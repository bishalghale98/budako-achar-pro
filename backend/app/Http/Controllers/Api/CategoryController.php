<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('products')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    public function showBySlug(string $slug): JsonResponse
    {
        $category = Category::withCount('products')->where('slug', $slug)->firstOrFail();

        return response()->json([
            'success' => true,
            'category' => new CategoryResource($category),
        ]);
    }
}
