<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Page\StorePageImageRequest;
use App\Models\Page;
use App\Models\PageImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminPageImageController extends Controller
{
    public function store(StorePageImageRequest $request, Page $page): JsonResponse
    {
        $file = $request->file('image');
        $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('pages/' . $page->id, $filename, 'public');
        $imageUrl = Storage::disk('public')->url($path);

        $image = $page->images()->create([
            'image_url' => $imageUrl,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Image uploaded successfully.',
            'image_url' => $imageUrl,
            'image' => [
                'id' => $image->id,
                'image_url' => $image->image_url,
                'original_name' => $image->original_name,
                'mime_type' => $image->mime_type,
                'size' => $image->size,
            ],
        ], 201);
    }

    public function destroy(Page $page, PageImage $image): JsonResponse
    {
        if ($image->page_id !== $page->id) {
            return response()->json([
                'success' => false,
                'message' => 'Image does not belong to this page.',
            ], 404);
        }

        if (str_starts_with($image->image_url, 'pages/')) {
            Storage::disk('public')->delete($image->image_url);
        }

        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Image deleted successfully.',
        ]);
    }
}
