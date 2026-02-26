<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image')->nullable(); // nullable por si no hay foto
            $table->string('kind');              // <--- Aquí estaba el error
            $table->double('weight');
            $table->integer('age');
            $table->string('breed');
            $table->string('location');
            $table->text('description');
            $table->boolean('active')->default(true);
            $table->string('status');
            $table->foreignId('owner_id')->constrained('users'); // Relación con usuarios
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pets');
    }
};
