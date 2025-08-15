<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NL2SQLController;
use App\Http\Controllers\ConnectionController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas de NL2SQL
Route::post('/nl2sql', [NL2SQLController::class, 'store']);
Route::post('/nl2sql/confirm', [NL2SQLController::class, 'confirm']);

// Rutas de usuario
Route::prefix('user')->group(function () {
    Route::post('/upgrade-to-premium', [UserController::class, 'upgradeToPremium']);
});
