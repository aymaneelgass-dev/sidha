<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectExpenseController;
use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'active', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('projects', ProjectController::class)->except('destroy');
    Route::patch('projects/{project}/archive', [ProjectController::class, 'archive'])->name('projects.archive');
    Route::scopeBindings()->group(function (): void {
        Route::post('projects/{project}/expenses', [ProjectExpenseController::class, 'store'])->name('projects.expenses.store');
        Route::put('projects/{project}/expenses/{expense}', [ProjectExpenseController::class, 'update'])->name('projects.expenses.update');
        Route::delete('projects/{project}/expenses/{expense}', [ProjectExpenseController::class, 'destroy'])->name('projects.expenses.destroy');
    });

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
    Route::get('team/create', [TeamController::class, 'create'])->name('team.create');
    Route::post('team', [TeamController::class, 'store'])->name('team.store');
    Route::get('team/{member}/edit', [TeamController::class, 'edit'])->name('team.edit');
    Route::put('team/{member}', [TeamController::class, 'update'])->name('team.update');
    Route::patch('team/{member}/suspend', [TeamController::class, 'suspend'])->name('team.suspend');
    Route::patch('team/{member}/reactivate', [TeamController::class, 'reactivate'])->name('team.reactivate');
    Route::post('team/{member}/resend-password', [TeamController::class, 'resendPassword'])
        ->middleware('throttle:3,1')
        ->name('team.resend-password');
});

require __DIR__.'/settings.php';
