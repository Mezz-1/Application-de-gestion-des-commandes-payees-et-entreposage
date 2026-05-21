<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Client extends Model
{
    protected $primaryKey = 'id_client';
    protected $fillable = [
        'nom_complet',
        'email',
        'telephone',
    ];
    public function commandes():BelongsTo{
        return $this->belongsTo(Commande::class,"commande_id","id_commande");
    }
}
