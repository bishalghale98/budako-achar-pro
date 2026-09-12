<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerDashboardController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $orders = Order::where('user_id', $user->id);

        $totalOrders = (clone $orders)->count();
        $activeOrders = (clone $orders)->whereIn('status', ['pending', 'confirmed', 'processing', 'shipped'])->count();
        $deliveredOrders = (clone $orders)->where('status', 'delivered')->count();
        $totalSpent = (clone $orders)->where('status', 'delivered')->sum('total');

        $recentOrders = Order::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->order_number,
                'date' => $order->created_at->format('M d, Y'),
                'amount' => 'NPR ' . number_format($order->total),
                'status' => $order->status->label(),
            ]);

        return response()->json([
            'success' => true,
            'stats' => [
                'total_orders' => $totalOrders,
                'active_orders' => $activeOrders,
                'delivered_orders' => $deliveredOrders,
                'total_spent' => 'NPR ' . number_format($totalSpent),
            ],
            'recent_orders' => $recentOrders,
        ]);
    }
}
