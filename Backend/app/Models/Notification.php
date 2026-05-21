<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $primaryKey = 'id_notification';
    protected $fillable = [
        'type',
        'date_envoi',
        'statut',
        'commande_id',
    ];
    public function commandes():BelongsTo{
        return $this->belongsTo(Commande::class,'commande_id','id_commande');
    }
}
