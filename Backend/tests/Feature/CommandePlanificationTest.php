<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Commande;
use App\Models\User; // 🛠️ Import your User model
use Illuminate\Foundation\Testing\RefreshDatabase;

class CommandePlanificationTest extends TestCase
{
    use RefreshDatabase; // 🧼 Cleans the database after the test runs

    /** @test */
    public function an_operator_cannot_schedule_delivery_on_a_canceled_order()
    {
        // 0. Authenticate an operator to bypass the 401 middleware restriction
        $user = User::factory()->create();
        $this->actingAs($user);

        // 1. Create a dummy canceled order (Using valid enum value for delivery)
        $commande = Commande::create([
            'id_commande' => 101,
            'date_paiment' => now()->subDays(5),
            'montant_ttc' => 5000,
            'statut_entrepot' => 'annulée',
            'statut_livraison' => 'non planifiée', // 🛠️ Fixed: Must match your migration allowed ENUM values
            'force_majeure' => false
        ]);

        $response = $this->putJson("/api/commandes/{$commande->id_commande}/planifier-livraison", [
            'date_livraison_prevue' => now()->addDays(2)->format('Y-m-d')
        ]);

        // 3. Assertions: Must return 403 Forbidden and the exact security error message
        $response->assertStatus(403);
        $response->assertJson([
            'success' => false,
            'message' => 'Action refusée : Impossible de planifier une livraison sur une commande annulée.'
        ]);
    }

    /** @test */
    public function an_operator_cannot_schedule_delivery_on_a_post_delai_order()
    {
        // 0. Authenticate an operator to bypass the 401 middleware restriction
        $user = User::factory()->create();
        $this->actingAs($user);

        // 1. Create a dummy expired grace period order
        $commande = Commande::create([
            'id_commande' => 102,
            'date_paiment' => now()->subDays(40),
            'montant_ttc' => 7500,
            'statut_entrepot' => 'post_delai',
            'statut_livraison' => 'planifiée',
            'force_majeure' => false
        ]);

        // 2. Attempt to bypass the frontend and send the payload
        $response = $this->putJson("/api/commandes/{$commande->id_commande}/planifier-livraison", [
            'date_livraison_prevue' => now()->addDays(1)->format('Y-m-d')
        ]);

        // 3. Assertions
        $response->assertStatus(403);
        $this->assertStringContainsString('délai réglementaire', $response->json('message'));
    }
}