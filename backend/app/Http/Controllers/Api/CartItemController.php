<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\CartItemException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Cart\AddCartItemRequest;
use App\Http\Requests\Api\Cart\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\CartItem;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartItemController extends Controller
{
    public function __construct(
        protected CartService $cartService,
    ) {}

    public function store(AddCartItemRequest $request): JsonResponse
    {
        try {
            $cart = $this->cartService->getOrCreateGuestCart($request);
            $cart = $this->cartService->addItem(
                $cart,
                $request->product_id,
                $request->product_variant_id,
                $request->quantity
            );

            return response()->json([
                'success' => true,
                'message' => 'Item added to cart.',
                'cart' => new CartResource($cart),
            ], 201);
        } catch (CartItemException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function update(UpdateCartItemRequest $request, string $cartItem): JsonResponse
    {
        $cart = $this->cartService->getOrCreateGuestCart($request);
        $item = $cart->items()->where('id', $cartItem)->first();

        if (! $item) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found.',
            ], 404);
        }

        try {
            $cart = $this->cartService->updateItem($cart, $item, $request->quantity);

            return response()->json([
                'success' => true,
                'message' => 'Cart item updated.',
                'cart' => new CartResource($cart),
            ]);
        } catch (CartItemException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function destroy(Request $request, string $cartItem): JsonResponse
    {
        $cart = $this->cartService->getOrCreateGuestCart($request);
        $item = $cart->items()->where('id', $cartItem)->first();

        if (! $item) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found.',
            ], 404);
        }

        try {
            $cart = $this->cartService->removeItem($cart, $item);

            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart.',
                'cart' => new CartResource($cart),
            ]);
        } catch (CartItemException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
