<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

use App\Http\Controllers\NL2SQLController;

Route::get('/nl2sql', [NL2SQLController::class, 'create'])->name('nl2sql.create');
Route::post('/nl2sql', [NL2SQLController::class, 'store'])->name('nl2sql.store');
Route::post('/nl2sql/confirm', [NL2SQLController::class, 'confirm'])->name('nl2sql.confirm');

use App\Http\Controllers\ConnectionController;

Route::resource('connections', ConnectionController::class);
