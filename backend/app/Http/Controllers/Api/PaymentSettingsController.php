<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentSettingsResource;
use App\Models\PaymentSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class PaymentSettingsController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = Cache::remember('payment_settings', 3600, function () {
            return PaymentSetting::instance();
        });

        return response()->json([
            'success' => true,
            'payment_settings' => new PaymentSettingsResource($settings),
        ]);
    }
}
