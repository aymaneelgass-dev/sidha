<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('studio_booking_mutex', function (Blueprint $table): void {
            $table->engine('InnoDB');
            $table->unsignedTinyInteger('id')->primary();
        });
        DB::table('studio_booking_mutex')->insert(['id' => 1]);

        Schema::create('studio_bookings', function (Blueprint $table): void {
            $table->engine('InnoDB');
            $table->id();
            $table->foreignId('client_id')->constrained()->restrictOnDelete();
            $table->string('service_type', 30);
            $table->date('booking_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->decimal('price', 12, 2);
            $table->string('status', 30)->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index(['booking_date', 'start_time']);
            $table->index(['status', 'booking_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('studio_bookings');
        Schema::dropIfExists('studio_booking_mutex');
    }
};
