<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Commande;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Http\Response;

class CommandeController extends Controller
{
    /**
     * Display a listing of orders with dynamic filters.
     */
    public function index(Request $request)
    {
        $query = Commande::query();

        if ($request->has('statut_livraison')) {
            $query->where('statut_livraison', $request->statut_livraison);
        }

        if ($request->has('statut_entrepot')) {
            $query->where('statut_entrepot', $request->statut_entrepot);
        }

        if (!$request->has('statut_livraison')) {
            $query->where('statut_livraison', '!=', 'livrée');
        }

        $commandes = $query->with('client')->get();

        return response()->json([
            'success' => true,
            'count' => $commandes->count(),
            'data' => $commandes,
        ], 200);
    }

    /**
     * Import new paid orders from ERP AX.
     */
    public function importerDepuisErp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'client' => 'required|string|max:255',
            'date_paiement' => 'required|date',
            'montant_ttc' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => "invalid data type",
                'errors' => $validator->errors(),
            ], 422);
        }

        // Updated to include structural default states for PFE specifications
        $commande = Commande::create([
            'client' => $request->client,
            'date_paiment' => $request->date_paiement,
            'montant_ttc' => $request->montant_ttc,
            'statut_livraison' => 'non planifiée',
            'date_livraison_prevue' => null,
            'statut_entrepot' => 'gratuit',
            'frais_appliqués' => false,
            'force_majeure' => false,
            'statut_remboursement' => 'non_applicable'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Commande importée avec succès via REST API.',
            'data' => $commande
        ], 201);
    }

    /**
     * Schedule a target shipment delivery date for an order.
     */
    public function planifierLivraison(Request $request, $id)
    {
        $commande = Commande::find($id);

        if (!$commande) {
            return response()->json([
                'success' => false,
                'message' => 'Commande introuvable.'
            ], 404);
        }
        if (trim(strtolower($commande->statut_entrepot)) === 'post_delai') {
            return response()->json([
                'success' => false,
                'message' => 'Action refusée : Le délai réglementaire d\'entreposage gratuit est dépassé. Ce dossier est bloqué.'
            ], 403);
        }
        $status = trim(mb_strtolower($commande->statut_entrepot, 'UTF-8'));

        if ($status === 'annulée' || $status === 'annulee') {
            return response()->json([
                'success' => false,
                'message' => 'Action refusée : Impossible de planifier une livraison sur une commande annulée.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'date_livraison_prevue' => 'required|date|after_or_equal:' . $commande->date_paiement,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $commande->update([
            'date_livraison_prevue' => $request->date_livraison_prevue,
            'statut_livraison' => 'planifiée'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Date de livraison planifiée enregistrée avec succès.',
            'data' => $commande
        ], 200);
    }

    /**
     * Handle customer cancellation requests due to KITEA delivery delays.
     */
    public function annulerCommande($id)
    {
        $commande = Commande::find($id);

        if (!$commande) {
            return response()->json([
                'success' => false,
                'message' => 'Commande introuvable.'
            ], 404);
        }
        if ($commande->force_majeure) {
            return response()->json([
                'success' => false,
                'message' => 'Annulation bloquée : Le retard de livraison est protégé par un cas de Force Majeure.'
            ], 403);
        }
        if ($commande->statut_livraison !== 'planifiée' || !$commande->date_livraison_prevue) {
            return response()->json([
                'success' => false,
                'message' => 'Cette commande n’est pas éligible à l’annulation (livraison non planifiée).'
            ], 400);
        }

        $datePrevue = Carbon::parse($commande->date_livraison_prevue);
        $today = Carbon::now();
        if (!$today->greaterThan($datePrevue) || $datePrevue->diffInDays($today) <= 7) {
            return response()->json([
                'success' => false,
                'message' => 'Annulation refusée : Le retard de livraison KITEA est inférieur au seuil réglementaire de 7 jours.'
            ], 400);
        }
        $commande->update([
            'statut_livraison' => 'annulée',
            'statut_entrepot' => 'annulee',
            'date_annulation' => $today,
            'date_limite_remboursement' => $today->copy()->addDays(15),
            'statut_remboursement' => 'en_attente'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Demande d’annulation validée avec succès (Simulation LRAR reçue).',
            'data' => [
                'id_commande' => $commande->id,
                'montant_remboursement' => $commande->montant_ttc . ' MAD',
                'date_annulation' => $commande->date_annulation,
                'date_limite_remboursement' => $commande->date_limite_remboursement,
                'statut_remboursement' => $commande->statut_remboursement
            ]
        ], 200);
    }
    public function basculerForceMajeure(Request $request, $id)
    {
        $commande = Commande::findOrFail($id);
        $status = trim(mb_strtolower($commande->statut_entrepot, 'UTF-8'));
        if ($status === 'annulée' || $status === 'annulee') {
            return response()->json([
                'success' => false,
                'message' => 'Action refusée : Impossible de modifier la clause de Force Majeure sur une commande annulée.'
            ], 403);
        }

        $request->validate([
            'force_majeure' => 'required|boolean'
        ]);

        $commande->update([
            'force_majeure' => $request->force_majeure
        ]);

        $statusMessage = $commande->force_majeure
            ? 'Cas de Force Majeure activé. Les pénalités et annulations sont gelées.'
            : 'Cas de Force Majeure désactivé. Le cycle standard reprend.';

        return response()->json([
            'success' => true,
            'message' => $statusMessage,
            'data' => $commande
        ], 200);
    }
    public function telechargerMiseEnDemeuere($id)
    {
        $commande = Commande::find($id);
        if (!$commande) {
            return response()->json([
                'success' => false,
                'message' => 'Commande introuvable'

            ], 404);
        }
        if ($commande->statut_entrepot != 'mise_en_demeure') {
            return response()->json([
                'status' => false,

                'message' => 'Cette commande n\'est pas encore au stade de mise en demeure.'
            ], 400);
        }
        $pdf = Pdf::loadView('pdf.mise_en_demeure', compact('commande'));
        $pdf->setPaper('A4', 'portrait');
        $nomFichier = 'KITEA_Mise_En_Demeure_Commande_' . $commande->id . '.pdf';
        return $pdf->download($nomFichier);
    }
}
