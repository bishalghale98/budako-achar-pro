<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function overview(): JsonResponse
    {
        $timezone = 'Asia/Kathmandu';
        $now = Carbon::now($timezone);
        $todayDate = $now->format('M d, Y');

        $data = Cache::remember('admin_dashboard_overview', 300, function () use ($now, $timezone) {
            $settings = SiteSetting::instance();

            $todayStart = (clone $now)->startOfDay()->timezone('UTC');
            $todayEnd = (clone $now)->endOfDay()->timezone('UTC');
            $yesterdayStart = (clone $now)->subDay()->startOfDay()->timezone('UTC');
            $yesterdayEnd = (clone $now)->subDay()->endOfDay()->timezone('UTC');
            $monthStart = (clone $now)->startOfMonth()->startOfDay()->timezone('UTC');
            $lastMonthStart = (clone $now)->subMonth()->startOfMonth()->startOfDay()->timezone('UTC');
            $lastMonthEnd = (clone $now)->subMonth()->endOfMonth()->endOfDay()->timezone('UTC');

            // KPIs: today's delivered sales
            $todayDelivered = DB::table('orders')
                ->where('status', 'delivered')
                ->where('created_at', '>=', $todayStart)
                ->where('created_at', '<=', $todayEnd)
                ->selectRaw('COUNT(*) as count, COALESCE(SUM(total), 0) as sales')
                ->first();

            // KPIs: yesterday's delivered sales (for % change)
            $yesterdayDelivered = DB::table('orders')
                ->where('status', 'delivered')
                ->where('created_at', '>=', $yesterdayStart)
                ->where('created_at', '<', $todayStart)
                ->selectRaw('COUNT(*) as count, COALESCE(SUM(total), 0) as sales')
                ->first();

            // KPIs: today's orders (all statuses)
            $todayOrders = DB::table('orders')
                ->where('created_at', '>=', $todayStart)
                ->where('created_at', '<=', $todayEnd)
                ->count();

            // KPIs: yesterday's orders (for % change)
            $yesterdayOrders = DB::table('orders')
                ->where('created_at', '>=', $yesterdayStart)
                ->where('created_at', '<', $todayStart)
                ->count();

            // KPIs: month delivered sales
            $monthDelivered = DB::table('orders')
                ->where('status', 'delivered')
                ->where('created_at', '>=', $monthStart)
                ->selectRaw('COALESCE(SUM(total), 0) as sales')
                ->first();

            // KPIs: last month delivered sales (for % change)
            $lastMonthDelivered = DB::table('orders')
                ->where('status', 'delivered')
                ->where('created_at', '>=', $lastMonthStart)
                ->where('created_at', '<=', $lastMonthEnd)
                ->selectRaw('COALESCE(SUM(total), 0) as sales')
                ->first();

            // KPIs: customers
            $totalCustomers = User::where('role', 'customer')->count();
            $newCustomersMonth = User::where('role', 'customer')
                ->where('created_at', '>=', $monthStart)
                ->count();
            $newCustomersLastMonth = User::where('role', 'customer')
                ->where('created_at', '>=', $lastMonthStart)
                ->where('created_at', '<=', $lastMonthEnd)
                ->count();

            // Order status counts (all 6, zero-filled)
            $statusCounts = DB::table('orders')
                ->select('status', DB::raw('COUNT(*) as count'))
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray();

            $orderStatus = [];
            foreach (['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as $s) {
                $orderStatus[$s] = (int) ($statusCounts[$s] ?? 0);
            }

            // Recent orders (5 latest)
            $recentOrders = DB::table('orders')
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(['id', 'order_number', 'customer_name', 'total', 'status', 'created_at'])
                ->toArray();

            // Top products (delivered orders only, by recorded subtotal)
            $topProducts = DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->where('orders.status', 'delivered')
                ->select(
                    'order_items.product_name',
                    'order_items.variant_name',
                    DB::raw('SUM(order_items.quantity) as units_sold'),
                    DB::raw('SUM(order_items.subtotal) as revenue')
                )
                ->groupBy('order_items.product_name', 'order_items.variant_name')
                ->orderByDesc('revenue')
                ->limit(5)
                ->get()
                ->toArray();

            // Low stock (active variants with stock <= 5)
            $lowStock = DB::table('product_variants')
                ->where('status', 'active')
                ->where('stock', '<=', 5)
                ->orderBy('stock')
                ->get(['product_id', 'name as variant_name', 'stock', 'sku'])
                ->toArray();

            // Resolve product names for low stock
            if (count($lowStock) > 0) {
                $productIds = array_unique(array_column($lowStock, 'product_id'));
                $productNames = DB::table('products')
                    ->whereIn('id', $productIds)
                    ->pluck('title', 'id')
                    ->toArray();

                $lowStock = array_map(function ($item) use ($productNames) {
                    return [
                        'product_name' => $productNames[$item->product_id] ?? 'Unknown',
                        'variant_name' => $item->variant_name,
                        'stock' => (int) $item->stock,
                        'sku' => $item->sku,
                    ];
                }, $lowStock);
            }

            // Compute % changes
            $todaySalesChange = $this->pctChange(
                (float) $yesterdayDelivered->sales,
                (float) $todayDelivered->sales
            );
            $todayOrdersChange = $this->pctChange($yesterdayOrders, $todayOrders);
            $monthSalesChange = $this->pctChange(
                (float) $lastMonthDelivered->sales,
                (float) $monthDelivered->sales
            );
            $customerGrowthPct = $this->pctChange($newCustomersLastMonth, $newCustomersMonth);

            // AOV: today's delivered AOV vs yesterday's delivered AOV
            $todayAov = $todayDelivered->count > 0
                ? round((float) $todayDelivered->sales / $todayDelivered->count, 2)
                : 0;
            $yesterdayAov = $yesterdayDelivered->count > 0
                ? round((float) $yesterdayDelivered->sales / $yesterdayDelivered->count, 2)
                : 0;
            $aovChange = $this->pctChange($yesterdayAov, $todayAov);

            return [
                'currency_code' => $settings->currency_code,
                'currency_symbol' => $settings->currency_symbol,
                'kpis' => [
                    'today_sales' => (float) $todayDelivered->sales,
                    'today_sales_change' => $todaySalesChange,
                    'today_orders' => $todayOrders,
                    'today_orders_change' => $todayOrdersChange,
                    'month_sales' => (float) $monthDelivered->sales,
                    'month_sales_change' => $monthSalesChange,
                    'total_customers' => $totalCustomers,
                    'new_customers_this_month' => $newCustomersMonth,
                    'customer_growth_pct' => $customerGrowthPct,
                    'average_order_value' => $todayAov,
                    'aov_change' => $aovChange,
                ],
                'order_status' => $orderStatus,
                'recent_orders' => $recentOrders,
                'top_products' => $topProducts,
                'low_stock' => $lowStock,
            ];
        });

        return response()->json(array_merge([
            'success' => true,
            'today_date' => $todayDate,
        ], $data));
    }

    private function pctChange(float $previous, float $current): float
    {
        if ($previous > 0) {
            return round(($current - $previous) / $previous * 100, 1);
        }

        return $current > 0 ? 100.0 : 0.0;
    }

    public function sales(Request $request): JsonResponse
    {
        $period = $request->validate([
            'period' => 'required|string|in:daily,weekly,monthly',
        ])['period'];

        $timezone = 'Asia/Kathmandu';
        $now = Carbon::now($timezone);
        $settings = SiteSetting::instance();

        $points = match ($period) {
            'daily' => $this->dailySales($now),
            'weekly' => $this->weeklySales($now),
            'monthly' => $this->monthlySales($now),
        };

        $totalSales = array_sum(array_column($points, 'sales'));
        $totalOrders = array_sum(array_column($points, 'orders'));

        return response()->json([
            'success' => true,
            'period' => $period,
            'currency_code' => $settings->currency_code,
            'currency_symbol' => $settings->currency_symbol,
            'summary' => [
                'total_sales' => (float) $totalSales,
                'total_orders' => $totalOrders,
                'average_order_value' => $totalOrders > 0 ? round($totalSales / $totalOrders, 2) : 0,
            ],
            'points' => $points,
        ]);
    }

    private function dailySales(Carbon $now): array
    {
        $startDate = (clone $now)->subDays(29)->startOfDay();
        $endDate = (clone $now)->endOfDay();

        $rows = DB::table('orders')
            ->where('status', 'delivered')
            ->where('created_at', '>=', $startDate->startOfDay()->timezone('UTC'))
            ->where('created_at', '<=', $endDate->timezone('UTC'))
            ->selectRaw('DATE(created_at) as date_key, COUNT(*) as orders, SUM(total) as sales')
            ->groupBy('date_key')
            ->get();

        $indexed = collect($rows)->keyBy('date_key');

        $points = [];
        for ($i = 0; $i < 30; $i++) {
            $date = (clone $now)->subDays(29 - $i);
            $key = $date->format('Y-m-d');
            $row = $indexed->get($key);

            $points[] = [
                'label' => $date->format('M d'),
                'date' => $key,
                'sales' => $row ? (float) $row->sales : 0,
                'orders' => $row ? (int) $row->orders : 0,
            ];
        }

        return $points;
    }

    private function weeklySales(Carbon $now): array
    {
        $weeks = [];
        for ($i = 11; $i >= 0; $i--) {
            $weekStart = (clone $now)->subWeeks($i)->startOfWeek(Carbon::MONDAY)->startOfDay();
            $weekEnd = (clone $weekStart)->endOfWeek(Carbon::SUNDAY)->endOfDay();
            $weeks[] = [
                'start' => $weekStart,
                'end' => $weekEnd,
                'label' => $weekStart->format('M d') . ' - ' . $weekEnd->format('M d'),
                'date' => $weekStart->format('Y-m-d'),
            ];
        }

        $firstStart = $weeks[0]['start']->timezone('UTC');
        $lastEnd = end($weeks)['end']->timezone('UTC');

        $rows = DB::table('orders')
            ->where('status', 'delivered')
            ->where('created_at', '>=', $firstStart)
            ->where('created_at', '<=', $lastEnd)
            ->selectRaw('DATE(created_at) as date_key, COUNT(*) as orders, SUM(total) as sales')
            ->groupBy('date_key')
            ->get();

        $points = [];
        foreach ($weeks as $week) {
            $weekStartDate = $week['start']->timezone('UTC')->format('Y-m-d');
            $weekEndDate = $week['end']->timezone('UTC')->format('Y-m-d');

            $weekOrders = 0;
            $weekSales = 0;

            foreach ($rows as $row) {
                if ($row->date_key >= $weekStartDate && $row->date_key <= $weekEndDate) {
                    $weekOrders += (int) $row->orders;
                    $weekSales += (float) $row->sales;
                }
            }

            $points[] = [
                'label' => $week['label'],
                'date' => $week['date'],
                'sales' => $weekSales,
                'orders' => $weekOrders,
            ];
        }

        return $points;
    }

    private function monthlySales(Carbon $now): array
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $monthStart = (clone $now)->subMonths($i)->startOfMonth()->startOfDay();
            $monthEnd = (clone $monthStart)->endOfMonth()->endOfDay();
            $months[] = [
                'start' => $monthStart,
                'end' => $monthEnd,
                'label' => $monthStart->format('M Y'),
                'date' => $monthStart->format('Y-m-d'),
            ];
        }

        $firstStart = $months[0]['start']->timezone('UTC');
        $lastEnd = end($months)['end']->timezone('UTC');

        $rows = DB::table('orders')
            ->where('status', 'delivered')
            ->where('created_at', '>=', $firstStart)
            ->where('created_at', '<=', $lastEnd)
            ->selectRaw('DATE(created_at) as date_key, COUNT(*) as orders, SUM(total) as sales')
            ->groupBy('date_key')
            ->get();

        $points = [];
        foreach ($months as $month) {
            $monthStartDate = $month['start']->timezone('UTC')->format('Y-m-d');
            $monthEndDate = $month['end']->timezone('UTC')->format('Y-m-d');

            $monthOrders = 0;
            $monthSales = 0;

            foreach ($rows as $row) {
                if ($row->date_key >= $monthStartDate && $row->date_key <= $monthEndDate) {
                    $monthOrders += (int) $row->orders;
                    $monthSales += (float) $row->sales;
                }
            }

            $points[] = [
                'label' => $month['label'],
                'date' => $month['date'],
                'sales' => $monthSales,
                'orders' => $monthOrders,
            ];
        }

        return $points;
    }
}
