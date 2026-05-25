<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCancellationAndForceMajeureFieldsToCommandesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('commandes', function (Blueprint $table) {
            $table->boolean('force_majeure')->default(false)->after('frais_appliqués');
            $table->dateTime('date_annulation')->nullable()->after('force_majeure');
            $table->date('date_limite_remboursement')->nullable()->after('date_annulation');
            $table->enum('statut_remboursement', ['non_applicable', 'en_attente', 'effectué'])
                  ->default('non_applicable')
                  ->after('date_limite_remboursement');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('commandes', function (Blueprint $table) {
            $table->dropColumn([
                'force_majeure', 
                'date_annulation', 
                'date_limite_remboursement', 
                'statut_remboursement'
            ]);
        });
    }
}