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
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CartItemController;
use App\Http\Controllers\Api\Customer\CustomerDashboardController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductReviewController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminProductVariantController;
use App\Http\Controllers\Api\Admin\AdminProductImageController;
use App\Http\Controllers\Api\Admin\AdminProductReviewController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\AddressController;
use App\Models\User;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

// Public authentication routes
Route::post('/register', RegisterController::class)->middleware('throttle:register');
Route::post('/login', LoginController::class)
    ->middleware([StartSession::class, 'throttle:login']);

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
        ->middleware([StartSession::class]);
    Route::post('/logout-all', LogoutAllController::class)
        ->middleware([StartSession::class, 'throttle:logout-all']);
    Route::post('/change-password', ChangePasswordController::class)
        ->middleware([StartSession::class]);

    // Email verification resend
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'send'])
        ->middleware('throttle:verification');

    // Profile
    Route::get('/user/profile', [ProfileController::class, 'show']);
    Route::patch('/user/profile', [ProfileController::class, 'update']);

    // Addresses
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{id}', [AddressController::class, 'update']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
    Route::put('/addresses/{id}/default', [AddressController::class, 'setDefault']);

    // Customer dashboard
    Route::get('/customer/dashboard', [CustomerDashboardController::class, 'show']);

    // Product reviews (authenticated users)
    Route::post('/products/{product}/reviews', [ProductReviewController::class, 'store']);
    Route::patch('/products/{product}/reviews/{review}', [ProductReviewController::class, 'update']);
    Route::delete('/products/{product}/reviews/{review}', [ProductReviewController::class, 'destroy']);
});

// Public product routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/products/{slug}/reviews', [ProductController::class, 'reviews']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'showBySlug']);

// Guest cart (public, no auth required)
Route::middleware(StartSession::class)->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::delete('/cart', [CartController::class, 'destroy']);
    Route::post('/cart/items', [CartItemController::class, 'store']);
    Route::patch('/cart/items/{cartItem}', [CartItemController::class, 'update']);
    Route::delete('/cart/items/{cartItem}', [CartItemController::class, 'destroy']);

    // Guest checkout
    Route::post('/orders', [OrderController::class, 'store']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'role:' . Role::Admin->value])->prefix('admin')->group(function () {
    Route::get('/users', function () {
        return response()->json([
            'success' => true,
            'users' => User::all()->only(['id', 'name', 'email', 'role', 'email_verified_at', 'created_at']),
        ]);
    });

    // Products
    Route::apiResource('products', AdminProductController::class);

    // Product variants
    Route::apiResource('products/{product}/variants', AdminProductVariantController::class);

    // Product images
    Route::apiResource('products/{product}/images', AdminProductImageController::class);
    Route::post('products/{product}/images/{image}/thumbnail', [AdminProductImageController::class, 'setThumbnail']);

    // Product reviews moderation
    Route::get('products/{product}/reviews', [AdminProductReviewController::class, 'index']);
    Route::post('products/{product}/reviews/{review}/approve', [AdminProductReviewController::class, 'approve']);
    Route::post('products/{product}/reviews/{review}/reject', [AdminProductReviewController::class, 'reject']);
    Route::delete('products/{product}/reviews/{review}', [AdminProductReviewController::class, 'destroy']);

    // Categories
    Route::apiResource('categories', AdminCategoryController::class);
});
