<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LogoutAllController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        DB::table('sessions')
            ->where('user_id', $user->id)
            ->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'All sessions have been terminated.',
        ]);
    }
}
