<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_plans', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('project_id')->unique()->constrained()->cascadeOnDelete();
            $table->json('content');
            $table->string('provider', 30);
            $table->string('model');
            $table->string('response_id')->nullable();
            $table->timestamp('generated_at', 6);
            $table->timestamps(6);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_plans');
    }
};
