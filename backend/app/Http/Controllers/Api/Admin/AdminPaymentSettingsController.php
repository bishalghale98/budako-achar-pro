<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Settings\UpdatePaymentSettingsRequest;
use App\Http\Resources\PaymentSettingsResource;
use App\Models\PaymentSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class AdminPaymentSettingsController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = PaymentSetting::instance();

        return response()->json([
            'success' => true,
            'payment_settings' => new PaymentSettingsResource($settings),
        ]);
    }

    public function update(UpdatePaymentSettingsRequest $request): JsonResponse
    {
        $settings = PaymentSetting::instance();
        $data = $request->validated();

        // Handle file uploads — store new, delete old
        $imagePaths = [];
        $imageFields = ['digital_payment_qr_image', 'bank_qr_image'];

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

        Cache::forget('payment_settings');

        return response()->json([
            'success' => true,
            'message' => 'Payment settings updated successfully.',
            'payment_settings' => new PaymentSettingsResource($settings->fresh()),
        ]);
    }
}
