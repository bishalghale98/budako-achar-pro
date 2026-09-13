<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
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
