<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\Commande;
use App\Models\Notification;
use App\Models\Frais;
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
        // 1. Fetch orders where status is NOT 'livrée', explicitly including NULL fields!
        $commandes = Commande::where(function ($query) {
            $query->where('statut_livraison', '!=', 'livrée')
                ->orWhereNull('statut_livraison');
        })
            ->with('client')
            ->get();

        $today = Carbon::now();

        $this->info("Found " . $commandes->count() . " active orders to process.");

        foreach ($commandes as $commande) {
            if ($commande->force_majeure) {
                $dejaNotifie = $commande->notification()
                    ->where('type', 'force_majeure')
                    ->exists();

                if (!$dejaNotifie) {
                    $commande->notification()->create([
                        'type' => 'force_majeure',
                        'date_envoi' => $today,
                        'statut' => 'Envoyé'
                    ]);

                    if ($commande->client) {
                        Mail::to($commande->client->email)->send(new \App\Mail\ForceMajeureStockage($commande));
                        $this->info("Force Majeure Notification & Mail sent for Commande #{$commande->id_commande}");
                    } else {
                        $this->error("Warning: Commande #{$commande->id_commande} is in Force Majeure but has no linked client profile!");
                    }
                }

                $this->warn("Skipping Commande #{$commande->id_commande} - Protected by Force Majeure.");
                continue;
            }

            $datePaiement = Carbon::parse($commande->date_paiment);
            $daysInStorage = $datePaiement->diffInDays($today);

            if ($daysInStorage >= 30 && $daysInStorage < 60 && $commande->statut_entrepot === 'gratuit' && !$commande->date_livraison_prevue ) {

                $commande->statut_entrepot = 'notifie';
                $commande->save();

                $commande->notification()->create([
                    'type' => 'notification',
                    'date_envoi' => $today,
                    'statut' => 'Envoyé'
                ]);

                if ($commande->client) {
                    Mail::to($commande->client->email)->send(new \App\Mail\RelanceStockage($commande));
                } else {
                    $this->error("Warning: Commande #{$commande->id_commande} has no linked client profile!");
                }

                $this->info("J+30 Notification triggered for Commande #{$commande->id_commande}");
            }

            if ($daysInStorage >= 60 && !$commande->frais_appliqués && !$commande->date_livraison_prevue) {

                $commande->statut_entrepot = 'mise_en_demeure';
                $commande->frais_appliqués = true;
                $commande->save();

                $montantPenalite = $commande->montant_ttc * 0.10;

                $commande->frais()->create([
                    'montant' => $montantPenalite,
                    'date_application' => $today
                ]);

                $commande->notification()->create([
                    'type' => 'mise_en_demeure',
                    'date_envoi' => $today,
                    'statut' => 'Envoyé'
                ]);
                if ($commande->client) {
                    Mail::to($commande->client->email)->send(new \App\Mail\MiseEnDemeureStockage($commande));
                } else {
                    $this->error("Warning: Commande #{$commande->id_commande} has no linked client profile!");
                }

                $this->info("J+60 Penalty Fee ({$montantPenalite} MAD) applied to Commande #{$commande->id_commande}");
            }


            if ($commande->statut_livraison === 'planifiée' && $commande->date_livraison_prevue) {

                $datePrevue = Carbon::parse($commande->date_livraison_prevue);

                // Check if the scheduled delivery target has already passed
                if ($today->greaterThan($datePrevue)) {
                    $daysDelayedByKitea = $datePrevue->diffInDays($today);

                    if ($daysDelayedByKitea > 7 && $commande->statut_entrepot !== 'post_delai') {
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
