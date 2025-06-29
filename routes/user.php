<?php

use App\Http\Controllers\UserController;

Route::post('/get/user', [UserController::class,'get'])->name('getUser');

Route::get("/get/user/all", [UserController::class,'all'])->name('getAllUsers');

Route::post('/update/user', [UserController::class,'update'])->name('updateUser');



