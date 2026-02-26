<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // <--- 1. IMPORTAR EL RASGO
use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    use HasFactory; // <--- 2. USAR EL RASGO

    protected $fillable = [
        'name',
        'image',
        'kind',
        'weight',
        'age',
        'breed',
        'location',
        'description',
        'active',
        'status',
        'owner_id', 
    ];
}