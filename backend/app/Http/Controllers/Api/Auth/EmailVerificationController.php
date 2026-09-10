<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email is already verified.',
            ]);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'message' => 'Verification link has been sent to your email.',
        ]);
    }

    public function verify(Request $request, string $id, string $hash): JsonResponse
    {
        $user = \App\Models\User::find($id);

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification link.',
            ], 404);
        }

        if (! hash_equals(
            (string) sha1($user->getEmailForVerification()),
            (string) $hash
        )) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification link.',
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email is already verified.',
            ]);
        }

        $user->markEmailAsVerified();

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully.',
        ]);
    }
}
