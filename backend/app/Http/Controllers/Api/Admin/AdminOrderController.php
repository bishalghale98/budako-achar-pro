<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Order\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['items', 'payment']);

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        $orders = $query->latest()
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

    public function show(string $id): JsonResponse
    {
        $order = Order::with(['items', 'payment', 'user', 'cancelledBy'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'order' => new OrderResource($order),
        ]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, string $id): JsonResponse
    {
        $order = Order::findOrFail($id);

        $order = $this->orderService->updateStatus(
            $order,
            $request->validated('status'),
        );

        return response()->json([
            'success' => true,
            'message' => 'Order status updated.',
            'order' => new OrderResource($order->load(['items', 'payment'])),
        ]);
    }
}
