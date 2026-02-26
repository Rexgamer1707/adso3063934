<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('pets', function (Blueprint $table) {
            // El método ->change() es el que aplica la modificación
            $table->unsignedBigInteger('owner_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('pets', function (Blueprint $table) {
            // Por si necesitas revertirlo, vuelve a ser obligatorio
            $table->unsignedBigInteger('owner_id')->nullable(false)->change();
        });
    }
};