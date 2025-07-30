<?php

use App\Http\Controllers\UserController;

// Rutas de usuarios - solo para administradores
Route::middleware(['auth', 'admin'])->group(function () {
    Route::post('/fetch/user', [UserController::class,'fetch'])->name('getUser');
    Route::get("/get/user/all", [UserController::class,'all'])->name('getAllUsers');
    Route::post('/update/user', [UserController::class,'update'])->name('updateUser');
    Route::post('/user/email/exist', [UserController::class, 'emailIsTaken'])->name('emailIsTaken');
});