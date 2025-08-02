<?php

use App\Http\Controllers\UserController;

// User management routes - protected by authentication and admin middleware
Route::middleware(['auth', 'admin'])->group(function () {
    // User retrieval routes
    Route::get('/user/{id}', [UserController::class,'get'])->name('getUserById');
    Route::post('/fetch/user', [UserController::class,'fetch'])->name('fetchUser');
    Route::get("/get/users", [UserController::class,'all'])->name('getAllUsers');
    
    // User update routes (supporting both parameter and request body)
    Route::post('/update/user/{id}', [UserController::class,'update'])->name('updateUserById');
    Route::post('/update/user', [UserController::class,'update'])->name('updateUser');
    
    // User validation routes
    Route::post('/user/email/exist', [UserController::class, 'emailIsTaken'])->name('emailIsTaken');
});
