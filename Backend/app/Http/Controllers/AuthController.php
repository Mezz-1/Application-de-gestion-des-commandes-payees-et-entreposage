<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function login (Request $request){
        $request->validate([
            'email'=>'required|email',
            'mot_de_pass'=>'required|string'
        ]);
        $user=User::where('email',$request->email)->first();
        if(!$user || !Hash::check($request->mot_de_pass , $user->mot_de_pass)){
            return response()->json([
                'message'=>'les informations fournis sont incorrect !!'
            ],401);
        }
        $token=$user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'token'=>$token,
            'token_type'=>'bearer',
            'user'=>[
                'id'=>$user->id,
                'nom_utilisateur'=>$user->nom_complet,
                'mot_de_pass'=>$user->mot_de_pass,
                'role'=>$user->role
            ]
        ],200);
    }
    public function register(Request $request){
        $request->validate([
            'nom_utilisateur' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'mot_de_pass' => 'required|string|min:6',
            'role' => ['required', Rule::in(['agent', 'administrateur'])],
        ]);
        $user=User::create([
            'nom_utilisateur'=>$request->nom_utilisateur,
            'email'=>$request->email,
            'mot_de_pass'=>Hash::make($request->mot_de_pass),
            'role'=>$request->role,
        ]);
        return response()->json([
            'success'=>true,
            'message'=>"L'utilisateur {$user->nom_utilisateur} a été créé avec le rôle {$user->role}.",
            'user'=>[
                'id'=>$user->id,
                'email'=>$user->email,
                'mot_de_pass'=>$user->mot_de_pass,
                'role'=>$user->role,
            ]
        ],201);

    }
    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message'=>'déconnexion réussie , session securisée fermée'
        ]);
    }
}
