<?php

use App\Http\Controllers\UserController;

Route::get('/user/{id}', [UserController::class,'get'])->name('getUser');
Route::get("/get/users", [UserController::class,'all'])->name('getAllUsers');
Route::post('/update/user/{id}', [UserController::class,'update'])->name('updateUser');



