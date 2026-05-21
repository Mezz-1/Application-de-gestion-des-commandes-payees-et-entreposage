<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Frais extends Model
{
    protected $primaryKey = 'id_frais';
    protected $fillable = [
        'montant',
        'date_application',
        'commande_id',
    ];
    public function commandes():BelongsTo{
        return $this->belongsTo(Commande::class,"commande_id","id_commande");
    }
}
