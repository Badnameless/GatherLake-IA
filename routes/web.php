<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\NL2SQLController;
use App\Http\Controllers\ConnectionController;

// Ruta raíz - Chat (requiere autenticación)
Route::get('/', function () {
    return Inertia::render('chat');
})->middleware(['auth.required', 'verified'])->name('chat');

// Rutas de autenticación
require __DIR__.'/auth.php';

// Rutas que requieren autenticación
Route::middleware(['auth.required', 'verified'])->group(function () {
    // Dashboard - debe usar vista Blade de Laravel
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->middleware(['auth.required', 'verified'])->name('dashboard');

    Route::get('/chat', function () {
        return Inertia::render('chat');
    })->name('chat');

    Route::get('/checkout', function () {
        return Inertia::render('checkout');
    })->name('checkout');

    Route::get('/pricing', function () {
        return Inertia::render('pricing');
    })->name('pricing');

    Route::get('/documentation', function () {
        return Inertia::render('documentation');
    })->name('documentation');

    Route::get('/faq', function () {
        return Inertia::render('faq');
    })->name('faq');

    Route::get('/contact', function () {
        return Inertia::render('contact');
    })->name('contact');

    Route::get('/changelog', function () {
        return Inertia::render('changelog');
    })->name('changelog');

    Route::get('/community-feed', function () {
        return Inertia::render('community-feed');
    })->name('community-feed');

    Route::get('/personal-feed', function () {
        return Inertia::render('personal-feed');
    })->name('personal-feed');

    Route::get('/finetuned-models', function () {
        return Inertia::render('finetuned-models');
    })->name('finetuned-models');

    Route::get('/profile', function () {
        return Inertia::render('profile');
    })->name('profile');

    Route::get('/settings', function () {
        return Inertia::render('settings');
    })->name('settings');

    Route::get('/billing', function () {
        return Inertia::render('billing');
    })->name('billing');

    Route::get('/notifications', function () {
        return Inertia::render('notifications');
    })->name('notifications');

    Route::get('/connections', function () {
        return Inertia::render('Connections/Index');
    })->name('connections');

    Route::get('/connections/create', function () {
        return Inertia::render('Connections/Create');
    })->name('connections.create');

    Route::get('/connections/{id}/edit', function ($id) {
        return Inertia::render('Connections/Edit', ['id' => $id]);
    })->name('connections.edit');

    // Ruta para obtener información del usuario actual
    Route::get('/api/user/current', [App\Http\Controllers\UserController::class, 'getCurrentUser']);

    // Rutas de conexiones - movidas desde API para usar sesión web
    Route::get('/api/connections', [App\Http\Controllers\ConnectionController::class, 'index']);
    Route::post('/api/connections', [App\Http\Controllers\ConnectionController::class, 'store']);
    Route::get('/api/connections/active', [App\Http\Controllers\ConnectionController::class, 'getActive']);
    Route::get('/api/connections/{id}', [App\Http\Controllers\ConnectionController::class, 'show']);
    Route::put('/api/connections/{id}', [App\Http\Controllers\ConnectionController::class, 'update']);
    Route::delete('/api/connections/{id}', [App\Http\Controllers\ConnectionController::class, 'destroy']);
    Route::post('/api/connections/{id}/activate', [App\Http\Controllers\ConnectionController::class, 'activate']);

    // Rutas de perfil y configuración - movidas desde API para usar sesión web
    Route::post('/api/profile/update', [App\Http\Controllers\UserController::class, 'updateProfile']);
    Route::put('/api/password/update', [App\Http\Controllers\UserController::class, 'updatePassword']);
    
    // Rutas NL2SQL - movidas desde API para usar sesión web
    Route::post('/api/nl2sql', [App\Http\Controllers\NL2SQLController::class, 'store']);
    Route::post('/api/nl2sql/confirm', [App\Http\Controllers\NL2SQLController::class, 'confirm']);
});
