<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/home', function () {
    return Inertia::render('welcome');
})->name('home');


Route::get('/', function () {
    return Inertia::render('chat');
})->name('chat');

Route::middleware(['auth', 'verified'])->group(function () {
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
