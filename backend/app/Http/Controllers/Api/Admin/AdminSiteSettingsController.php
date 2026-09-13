<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Settings\UpdateSiteSettingsRequest;
use App\Http\Resources\SiteSettingsResource;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class AdminSiteSettingsController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = SiteSetting::instance();

        return response()->json([
            'success' => true,
            'site_settings' => new SiteSettingsResource($settings),
        ]);
    }

    public function update(UpdateSiteSettingsRequest $request): JsonResponse
    {
        $settings = SiteSetting::instance();
        $data = $request->validated();

        // Handle file uploads — store new, delete old
        $imagePaths = [];
        $imageFields = ['brand_logo', 'favicon', 'og_image'];

        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                if ($settings->{$field}) {
                    Storage::disk('public')->delete($settings->{$field});
                }
                $imagePaths[$field] = $request->file($field)->store('site-settings', 'public');
            }
        }

        // Remove file inputs from text data
        foreach ($imageFields as $field) {
            unset($data[$field]);
        }

        // Merge: existing + new text fields
        $mergedData = array_merge($settings->toArray(), $data);

        // Apply uploaded image paths
        foreach ($imagePaths as $field => $path) {
            $mergedData[$field] = $path;
        }

        $settings->update($mergedData);

        Cache::forget('site_settings');

        return response()->json([
            'success' => true,
            'message' => 'Site settings updated successfully.',
            'site_settings' => new SiteSettingsResource($settings->fresh()),
        ]);
    }
}
