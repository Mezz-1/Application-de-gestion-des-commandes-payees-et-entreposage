<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Commande;
use App\Models\Frais;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get real-time aggregated statistics for the React dashboard.
     */
    public function getStats()
    {
        $today = Carbon::now();
        $totalInWarehouse = Commande::where('statut_livraison', '!=', 'livrée')
            ->orWhereNull('statut_livraison')
            ->count();

        $phaseGratuit = Commande::where('statut_entrepot', 'gratuit')->count();
        $phaseNotifie = Commande::where('statut_entrepot', 'notifie')->count();
        $phaseMiseEnDemeure = Commande::where('statut_entrepot', 'mise_en_demeure')->count();
        $totalPenalties = Frais::sum('montant');

        $delayedShipments = Commande::where('statut_livraison', 'planifiée')
            ->whereNotNull('date_livraison_prevue')
            ->where('date_livraison_prevue', '<', $today)
            ->get()
            ->filter(function ($commande) use ($today) {
                return Carbon::parse($commande->date_livraison_prevue)->diffInDays($today) > 7;
            })
            ->count();
        $activeForceMajeure = Commande::where('force_majeure', true)->count();

        return response()->json([
            'success' => true,
            'metrics' => [
                'total_commandes_entrepot' => $totalInWarehouse,
                'phase_gratuit_count'      => $phaseGratuit,
                'phase_notifie_count'      => $phaseNotifie,
                'phase_mise_demeure_count' => $phaseMiseEnDemeure,
                'total_penalites_mad'      => $totalPenalties,
                'retards_livraison_kitea'  => $delayedShipments,
                'cas_force_majeure_actifs' => $activeForceMajeure,
            ]
        ], 200);
    }
}