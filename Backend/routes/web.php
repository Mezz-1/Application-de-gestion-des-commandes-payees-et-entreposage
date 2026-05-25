<?php

use Illuminate\Support\Facades\Route;
use App\Models\Commande;
use Illuminate\Support\Facades\Mail;

Route::get('/debug-smtp-live', function () {
    // 1. Grab your test command row
    $commande = Commande::first();
    
    try {
        // 2. Fire the actual HTML Mailable class over the SMTP network!
        Mail::to('mezzoukhry@gmail.com')->send(new \App\Mail\RelanceStockage($commande));
        return "SUCCESS! The HTML design layout has been sent to your inbox.";
    } catch (\Exception $e) {
        return "SMTP Delivery Failed! Reason: " . $e->getMessage();
    }
});
