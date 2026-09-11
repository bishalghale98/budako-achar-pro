<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Order\PlaceOrderRequest;
use App\Http\Resources\OrderResource;
use App\Services\CartService;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        protected CartService $cartService,
        protected OrderService $orderService,
    ) {}

    public function store(PlaceOrderRequest $request): JsonResponse
    {
        $cart = $this->cartService->getOrCreateGuestCart($request);

        $order = $this->orderService->placeOrder(
            $cart,
            $request->validated(),
            $request->file('payment_proof'),
        );

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully.',
            'order' => new OrderResource($order),
        ], 201);
    }
}
