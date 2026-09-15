<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(
        protected CartService $cartService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $cart = $this->cartService->getOrCreateGuestCart($request);
        $cart = $this->cartService->getCart($cart);

        return response()->json([
            'success' => true,
            'cart' => new CartResource($cart),
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $cart = $this->cartService->getOrCreateGuestCart($request);
        $this->cartService->clearCart($cart);

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully.',
        ]);
    }
}
