<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Address\AddressRequest;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $addresses = $request->user()
            ->addresses()
            ->orderByDesc('is_default')
            ->orderByDesc('updated_at')
            ->get();

        return response()->json([
            'success' => true,
            'addresses' => $addresses,
        ]);
    }

    public function store(AddressRequest $request): JsonResponse
    {
        $address = $request->user()->addresses()->create($request->validated());

        if ($request->boolean('is_default')) {
            $address->setAsDefault();
        }

        return response()->json([
            'success' => true,
            'message' => 'Address created successfully.',
            'address' => $address,
        ], 201);
    }

    public function update(AddressRequest $request, string $id): JsonResponse
    {
        $address = $request->user()
            ->addresses()
            ->where('id', $id)
            ->firstOrFail();

        $address->update($request->validated());

        if ($request->boolean('is_default')) {
            $address->setAsDefault();
        }

        return response()->json([
            'success' => true,
            'message' => 'Address updated successfully.',
            'address' => $address,
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $address = $request->user()
            ->addresses()
            ->where('id', $id)
            ->firstOrFail();

        $address->delete();

        return response()->json([
            'success' => true,
            'message' => 'Address deleted successfully.',
        ]);
    }

    public function setDefault(Request $request, string $id): JsonResponse
    {
        $address = $request->user()
            ->addresses()
            ->where('id', $id)
            ->firstOrFail();

        $address->setAsDefault();

        return response()->json([
            'success' => true,
            'message' => 'Default address updated.',
            'address' => $address,
        ]);
    }
}
