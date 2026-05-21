<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/relance-stockage', function () {
    return view('emails.relance_stockage');
});

Route::get('/mise-en-demeur', function () {
    return view('emails.mise_en_demeur');
});
