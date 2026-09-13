<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Order\CancelOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerOrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $orders = Order::with(['items', 'payment'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'orders' => OrderResource::collection($orders),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $order = Order::with(['items', 'payment'])
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'order' => new OrderResource($order),
        ]);
    }

    public function cancel(CancelOrderRequest $request, string $id): JsonResponse
    {
        $order = Order::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $order = $this->orderService->cancelOrder(
            $order,
            $request->user(),
            $request->validated('reason'),
        );

        return response()->json([
            'success' => true,
            'message' => 'Order cancelled successfully.',
            'order' => new OrderResource($order->load(['items', 'payment'])),
        ]);
    }
}
