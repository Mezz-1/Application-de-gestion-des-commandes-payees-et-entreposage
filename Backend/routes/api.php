<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\CommandeController;


Route::post('/login', [AuthController::class, 'login']);

    Route::post('/users/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);

    
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/commandes', [CommandeController::class, 'index']);                 
    Route::get('/commandes/retards', [CommandeController::class, 'getRetards']);   
    Route::put('/commandes/{id}/livrer', [CommandeController::class, 'marquerLivree']); 
});