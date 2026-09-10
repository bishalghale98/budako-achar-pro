<?php

use App\Enums\Role;
use App\Http\Controllers\Api\Auth\ChangePasswordController;
use App\Http\Controllers\Api\Auth\EmailVerificationController;
use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutAllController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\MeController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Api\User\ProfileController;
use Illuminate\Support\Facades\Route;

// Public authentication routes
Route::post('/register', RegisterController::class)->middleware('throttle:register');
Route::post('/login', LoginController::class)
    ->middleware([\Illuminate\Session\Middleware\StartSession::class, 'throttle:login']);

// Password recovery (public)
Route::post('/forgot-password', ForgotPasswordController::class)->middleware('throttle:forgot-password');
Route::post('/reset-password', ResetPasswordController::class)->middleware('throttle:reset-password');

// Email verification (public, signed URL)
Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware('signed')
    ->name('verification.verify');

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth actions
    Route::get('/me', MeController::class);
    Route::post('/logout', LogoutController::class)
        ->middleware([\Illuminate\Session\Middleware\StartSession::class]);
    Route::post('/logout-all', LogoutAllController::class)
        ->middleware([\Illuminate\Session\Middleware\StartSession::class, 'throttle:logout-all']);
    Route::post('/change-password', ChangePasswordController::class)
        ->middleware([\Illuminate\Session\Middleware\StartSession::class]);

    // Email verification resend
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'send'])
        ->middleware('throttle:verification');

    // Profile
    Route::get('/user/profile', [ProfileController::class, 'show']);
    Route::patch('/user/profile', [ProfileController::class, 'update']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'role:' . Role::Admin->value])->prefix('admin')->group(function () {
    Route::get('/users', function () {
        return response()->json([
            'success' => true,
            'users' => \App\Models\User::all()->only('id', 'name', 'email', 'role', 'email_verified_at', 'created_at'),
        ]);
    });
});
