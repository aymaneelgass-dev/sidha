<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'mysql') {
            $clientTable = DB::selectOne('SELECT ENGINE AS engine FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?', ['clients']);
            if (! $clientTable || strcasecmp((string) $clientTable->engine, 'InnoDB') !== 0) {
                throw new RuntimeException('SIDHA Projects requires an existing InnoDB clients table. Have the database administrator migrate its storage engine before retrying; no existing table was modified.');
            }
        }
        Schema::create('projects', function (Blueprint $table): void {
            $table->engine('InnoDB');
            $table->id();
            $table->foreignId('client_id')->constrained()->restrictOnDelete();
            $table->string('name', 150);
            $table->string('type', 30)->index();
            $table->string('status', 30)->default('brief')->index();
            $table->decimal('budget', 12, 2);
            $table->date('start_date')->nullable();
            $table->date('deadline')->nullable();
            $table->text('brief')->nullable();
            $table->timestamps();
            $table->index(['created_at', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
