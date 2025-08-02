<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\NL2SQLController;
use App\Http\Controllers\ConnectionController;

Route::get('/home', function () {
    return Inertia::render('welcome');
})->name('home');

// Rutas que requieren autenticación
Route::middleware(['auth.required', 'verified'])->group(function () {
    // Chat - protegido por autenticación
    Route::get('/', function () {
        return Inertia::render('chat');
    })->name('chat');

    // NL2SQL - protegido por autenticación
    Route::get('/nl2sql', [NL2SQLController::class, 'create'])->name('nl2sql.create');
    Route::post('/nl2sql', [NL2SQLController::class, 'store'])->name('nl2sql.store');
    Route::post('/nl2sql/confirm', [NL2SQLController::class, 'confirm'])->name('nl2sql.confirm');

    // Conexiones - protegido por autenticación
    Route::get('/connections/active', [ConnectionController::class, 'getActive'])->name('connections.active');
    Route::post('/connections/{id}/activate', [ConnectionController::class, 'activate'])->name('connections.activate');
    Route::resource('connections', ConnectionController::class);

    // Dashboard - solo para administradores
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->middleware(['admin'])->name('dashboard');

    // Rutas de usuarios - solo para administradores
    Route::prefix('users')->middleware(['admin'])->group(function () {
        // Listado de usuarios (estático)
        Route::get('/', function () {
            return Inertia::render('users/index');
        })->name('users.index');
        
        // Detalles de usuario (estático)
        Route::get('/{id}', function ($id) {
            return Inertia::render('users/show', [
                'userId' => $id // Pasamos el ID como prop
            ]);
        })->name('users.show');
        
        // Edición de usuario (estático)
        Route::get('/{id}/edit', function ($id) {
            return Inertia::render('users/edit', [
                'userId' => $id // Pasamos el ID como prop
            ]);
        })->name('users.edit');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
