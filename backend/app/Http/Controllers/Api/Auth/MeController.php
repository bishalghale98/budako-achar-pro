<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()->only('id', 'name', 'email', 'role', 'email_verified_at'),
        ]);
    }
}
