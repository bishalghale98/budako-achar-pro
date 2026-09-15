<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Page\StorePageRequest;
use App\Http\Requests\Api\Page\UpdatePageRequest;
use App\Http\Resources\PageResource;
use App\Models\Page;
use App\Services\PageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPageController extends Controller
{
    public function __construct(
        protected PageService $pageService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $pages = Page::query()
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->search, fn ($q, $search) => $q->where('title', 'like', '%' . $this->escapeLike($search) . '%'))
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'pages' => PageResource::collection($pages),
            'pagination' => [
                'current_page' => $pages->currentPage(),
                'last_page' => $pages->lastPage(),
                'per_page' => $pages->perPage(),
                'total' => $pages->total(),
            ],
        ]);
    }

    public function store(StorePageRequest $request): JsonResponse
    {
        $page = $this->pageService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Page created successfully.',
            'page' => new PageResource($page),
        ], 201);
    }

    public function show(Page $page): JsonResponse
    {
        return response()->json([
            'success' => true,
            'page' => new PageResource($page),
        ]);
    }

    public function update(UpdatePageRequest $request, Page $page): JsonResponse
    {
        $this->pageService->update($page, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Page updated successfully.',
            'page' => new PageResource($page->fresh()),
        ]);
    }

    public function destroy(Page $page): JsonResponse
    {
        $this->pageService->delete($page);

        return response()->json([
            'success' => true,
            'message' => 'Page deleted successfully.',
        ]);
    }
}
