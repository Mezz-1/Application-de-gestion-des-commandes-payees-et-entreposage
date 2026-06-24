<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\CommandeController;
use App\Http\Controllers\API\DashboardController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/users/register', [AuthController::class, 'register']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/commandes', [CommandeController::class, 'index']);
    Route::get('/commandes/retards', [CommandeController::class, 'getRetards']);
    Route::put('/commandes/{id}/livrer', [CommandeController::class, 'marquerLivree']);
    Route::post('/erp/commandes', [CommandeController::class, 'importerDepuisErp']);
    Route::put('/commandes/{id}/planifier-livraison', [CommandeController::class, 'planifierLivraison']);
    Route::post('/commandes/{id}/annuler', [CommandeController::class, 'annulerCommande']);
    Route::post('/commandes/{id}/toggle-force-majeure', [CommandeController::class, 'basculerForceMajeure']);
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('/commandes/{id}/pdf-mise-en-demeure', [CommandeController::class, 'telechargerMiseEnDemeuere']);
    Route::get('/dashboard/alerts-history', [DashboardController::class, 'historiqueAlertes']);
    Route::get('/dashboard/penalties', [DashboardController::class, 'getPenaltyLogs']);
});
