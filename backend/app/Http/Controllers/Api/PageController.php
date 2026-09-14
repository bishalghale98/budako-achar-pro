<?php

namespace App\Http\Controllers\Api;

use App\Enums\PageStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    public function show(string $slug): JsonResponse
    {
        $page = Page::where('slug', $slug)
            ->where('status', PageStatus::Published)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'page' => new PageResource($page),
        ]);
    }
}
