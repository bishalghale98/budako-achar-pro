<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SiteSettingsController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = Cache::remember('site_settings', 3600, function () {
            return SiteSetting::instance()->attributesToArray();
        });

        return response()->json([
            'success' => true,
            'site_settings' => $settings,
        ]);
    }
}
