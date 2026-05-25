<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Commande extends Model
{
    protected $primaryKey = 'id_commande';
    protected $fillable = [
        'id_commande',
        'client_id',
        'date_paiment',
        'montant_ttc',
        'statut_livraison',
        'date_livraison_prevue',
        'statut_entrepot',
        'frais_appliqués',
        'force_majeure',
        'date_annulation',
        'date_limite_remboursement',
        'statut_remboursement',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function notification(): HasMany
    {
        return $this->hasMany(Notification::class, "commande_id", "id_commande");
    }
    public function frais(): HasMany
    {
        return $this->hasMany(Frais::class, "commande_id", "id_commande");
    }
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, "client_id", "id_client");
    }
}
