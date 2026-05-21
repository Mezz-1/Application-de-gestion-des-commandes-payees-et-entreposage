<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\Commande;
use Illuminate\Support\Facades\Mail;

class CheckStorageDelays extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-storage-delays';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scans orders nightly to calculate storage aging, apply penalties, and track KITEA delivery delays.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // 1. Fetch only orders that are NOT fully delivered yet, eager loading the customer profiles
        $commandes = Commande::where('statut_livraison', '!=', 'livrée')
                             ->with('client')
                             ->get();

        $today = Carbon::now();

        // 2. Loop through every active order row
        foreach ($commandes as $commande) {
            
            // Calculate total days elapsed in the warehouse since payment
            $datePaiement = Carbon::parse($commande->date_paiement);
            $daysInStorage = $datePaiement->diffInDays($today);

            // =============================================================
            // WORKFLOW A: CUSTOMER WAREHOUSE AGING (J+30 & J+60 Rules)
            // =============================================================

            // THRESHOLD 1: The 30-Day Storage Expiration (J+30)
            if ($daysInStorage >= 30 && $daysInStorage < 60 && $commande->statut_entrepot === 'gratuit') {
                
                $commande->statut_entrepot = 'notifie';
                $commande->save();

                // Log a history tracking footprint into your Notifications table
                $commande->notifications()->create([
                    'type' => 'notification',
                    'date_envoi' => $today,
                    'statut' => 'Envoyé'
                ]);

                // Fire the mail system to the customer's email address
                Mail::to($commande->client->email)->send(new \App\Mail\RelanceStockage($commande));
                
                $this->info("J+30 Notification triggered for Commande #{$commande->id_commande}");
            }

            // THRESHOLD 2: The 60-Day Legal Penalty Window (J+60)
            if ($daysInStorage >= 60 && !$commande->frais_appliqués) {
                
                // Flip statuses
                $commande->statut_entrepot = 'mise_en_demeure';
                $commande->frais_appliqués = true;
                $commande->save();

                // Calculate the 10% penalty charge precisely
                $montantPenalite = $commande->montant_ttc * 0.10;

                // Insert a matching penalty logging row into your Frais table
                $commande->frais()->create([
                    'montant' => $montantPenalite,
                    'date_application' => $today
                ]);

                // Log the severe legal alert notification footprint
                $commande->notifications()->create([
                    'type' => 'mise_en_demeure',
                    'date_envoi' => $today,
                    'statut' => 'Envoyé'
                ]);

                // Fire the official legal notice mail to the customer
                Mail::to($commande->client->email)->send(new \App\Mail\MiseEnDemeureStockage($commande));

                $this->info("J+60 Penalty Fee ({$montantPenalite} MAD) applied to Commande #{$commande->id_commande}");
            }

            // =============================================================
            // WORKFLOW B: KITEA DELIVERY DELAYS (J+7 Missed Target Rule)
            // =============================================================
            
            if ($commande->statut_livraison === 'planifiée' && $commande->date_livraison_prevue) {
                
                $datePrevue = Carbon::parse($commande->date_livraison_prevue);
                
                // Check if the scheduled delivery target has already passed
                if ($today->greaterThan($datePrevue)) {
                    $daysDelayedByKitea = $datePrevue->diffInDays($today);

                    // Rule: If KITEA is late by more than 7 days, flag it for cancellation eligibility
                    if ($daysDelayedByKitea > 7 && $commande->statut_entrepot !== 'post_delai') {
                        
                        // We flag the order state so the Agent dashboard turns it red/highlights it
                        $commande->statut_entrepot = 'post_delai'; 
                        $commande->save();
                        
                        $this->warn("KITEA Delay: Commande #{$commande->id_commande} is overdue by {$daysDelayedByKitea} days! Eligible for customer cancellation.");
                    }
                }
            }
        }

        $this->info('Daily warehouse automation sequence completed successfully.');
        return Command::SUCCESS;
    }
}