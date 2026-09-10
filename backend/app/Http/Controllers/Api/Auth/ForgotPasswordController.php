<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\ForgotPasswordRequest;
use App\Models\User;
use App\Notifications\PasswordResetNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    public function __invoke(ForgotPasswordRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if ($user) {
            $token = Password::createToken($user);

            $resetUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'))
                . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);

            $user->notify(new PasswordResetNotification($resetUrl));
        }

        return response()->json([
            'success' => true,
            'message' => 'If an account exists for that email, a password reset link has been sent.',
        ]);
    }
}
