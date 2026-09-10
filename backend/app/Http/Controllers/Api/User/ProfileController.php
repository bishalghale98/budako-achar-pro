<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\User\UpdateProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()->only('id', 'name', 'email', 'role', 'email_verified_at', 'created_at'),
        ]);
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($user->wasChanged('email')) {
            $user->email_verified_at = null;
            $user->save();
            $user->sendEmailVerificationNotification();
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'user' => $user->only('id', 'name', 'email', 'role', 'email_verified_at'),
        ]);
    }
}
