<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id('id_commande');
            $table->dateTime('date_paiment');
            $table->decimal('montant_ttc', 10, 2);
            $table->enum('statut_livraison', ['non_planifiée', 'planifiée', 'livrée'])->default('non_planifiée');
            $table->dateTime('date_livraison_prevue')->nullable();
            $table->enum('statut_entrepot', ['gratuit', 'notifie', 'mise_en_demeure', 'post_delai'])->default('gratuit');
            $table->boolean('frais_appliqués')->default(false);
            $table->foreignId('user_id')->nullable()->constrained('users','id')->onDelete('set null');
            $table->foreignId('client_id')->nullable()->constrained('clients','id_client')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
