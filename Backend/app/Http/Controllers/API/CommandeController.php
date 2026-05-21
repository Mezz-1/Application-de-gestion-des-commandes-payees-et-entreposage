<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Commande;
use Illuminate\Support\Facades\Validator;

class CommandeController extends Controller
{
    public function index(Request $request){
        $query=Commande::query();
        if($request->has('status_livraison')){
            $query->where('status_livraison',$request->statut_livraison);
        }
        if($request->has('statut_entrepot')){
            $query->where('statut_entrepot',$request->statut_entrepot);
        }
        if(!$request->has('status_livraison')){
            $query->where('status_livraison','!=','livrée');
        }
        $commandes=$query->get();
        return response()->json([
            'success'=>true,
            'count'=>$commandes->count(),
            'data'=>$commandes,
        ],200);

    }
    public function importerDepuisErp(Request $request){
        $validator = Validator::make($request->all(),[
            'client'=> 'required|string|max:255',
            'date_paiement' =>'required|date',
            'montant_ttc' => 'required|numeric',
        ]);

        if($validator->fails()){
            return response()->json([
                'success'=>false,
                'message'=>"invalid data type",
                'errors'=>$validator->errors(),

            ],422);
        }
        $commande = Commande::create([
            'client' => $request->client,
            'date_paiement' => $request->date_paiement,
            'montant_ttc' => $request->montant_ttc,
            'statut_livraison' => 'non planifiée', 
            'date_livraison_prevue' => null,
            'statut_entrepot' => 'gratuit',
            'frais_appliqués' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Commande importée avec succès via REST API.',
            'data' => $commande
        ], 201);
    }
public function planifierLivraison(Request $request, $id)
    {
        $commande = Commande::find($id);

        if (!$commande) {
            return response()->json([
                'success' => false,
                'message' => 'Commande introuvable.'
            ], 404);
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
}
