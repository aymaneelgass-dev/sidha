<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'active', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::inertia('projects', 'coming-soon', [
        'pageTitle' => 'Projects',
        'pageDescription' => 'Plan, produce, and deliver creative work from one place.',
        'moduleIcon' => 'clapperboard',
    ])->name('projects.index');

    Route::inertia('studio', 'coming-soon', [
        'pageTitle' => 'Studio',
        'pageDescription' => 'Coordinate recording spaces, sessions, and studio resources.',
        'moduleIcon' => 'audio-lines',
    ])->name('studio.index');

    Route::resource('clients', ClientController::class)->except('destroy');
    Route::patch('clients/{client}/archive', [ClientController::class, 'archive'])
        ->name('clients.archive');
    Route::patch('clients/{client}/reactivate', [ClientController::class, 'reactivate'])
        ->name('clients.reactivate');

    Route::inertia('calendar', 'coming-soon', [
        'pageTitle' => 'Calendar',
        'pageDescription' => 'Bring shoots, sessions, meetings, and deadlines together.',
        'moduleIcon' => 'calendar-days',
    ])->name('calendar.index');

    Route::inertia('sidha-ai', 'coming-soon', [
        'pageTitle' => 'SIDHA AI',
        'pageDescription' => 'A future creative assistant for the SIDHA production workflow.',
        'moduleIcon' => 'sparkles',
    ])->name('sidha-ai.index');

    Route::get('team', [TeamController::class, 'index'])->name('team.index');
});

require __DIR__.'/settings.php';
