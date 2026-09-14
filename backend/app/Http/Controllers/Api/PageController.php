<?php

namespace App\Http\Controllers\Api;

use App\Enums\PageStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    public function index(): JsonResponse
    {
        $pages = Page::where('status', PageStatus::Published)
            ->select('title', 'slug')
            ->orderBy('title')
            ->get();

        return response()->json([
            'success' => true,
            'pages' => $pages,
        ]);
    }

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
