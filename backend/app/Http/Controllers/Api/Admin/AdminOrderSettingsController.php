<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Settings\UpdateOrderSettingsRequest;
use App\Http\Resources\OrderSettingsResource;
use App\Models\OrderSetting;
use Illuminate\Http\JsonResponse;

class AdminOrderSettingsController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = OrderSetting::instance();

        return response()->json([
            'success' => true,
            'order_settings' => new OrderSettingsResource($settings),
        ]);
    }

    public function update(UpdateOrderSettingsRequest $request): JsonResponse
    {
        $settings = OrderSetting::instance();
        $settings->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Order settings updated successfully.',
            'order_settings' => new OrderSettingsResource($settings->fresh()),
        ]);
    }
}
