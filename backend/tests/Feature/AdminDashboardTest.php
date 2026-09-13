<?php

namespace Tests\Feature;

use App\Enums\CartStatus;
use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        Session::start();

        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    private function createDeliveredOrder(string $total = '1500.00', string $createdAt = '2026-09-10 10:00:00'): Order
    {
        $cart = Cart::factory()->create(['status' => CartStatus::Converted]);

        $order = Order::create([
            'order_number' => 'BKA-' . str_pad(Order::count() + 1, 4, '0', STR_PAD_LEFT),
            'cart_id' => $cart->id,
            'customer_name' => 'Test Customer',
            'customer_phone' => '9800000000',
            'customer_email' => 'test@example.com',
            'address_line' => 'Test Address',
            'city' => 'Itahari',
            'province' => 'Koshi',
            'status' => 'delivered',
            'subtotal' => $total,
            'delivery_fee' => '100.00',
            'total' => $total,
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ]);

        return $order;
    }

    private function createOrderWithStatus(string $status, string $total = '1500.00'): Order
    {
        $cart = Cart::factory()->create(['status' => CartStatus::Converted]);

        return Order::create([
            'order_number' => 'BKA-' . str_pad(Order::count() + 1, 4, '0', STR_PAD_LEFT),
            'cart_id' => $cart->id,
            'customer_name' => 'Test Customer',
            'customer_phone' => '9800000000',
            'customer_email' => 'test@example.com',
            'address_line' => 'Test Address',
            'city' => 'Itahari',
            'province' => 'Koshi',
            'status' => $status,
            'subtotal' => $total,
            'delivery_fee' => '100.00',
            'total' => $total,
        ]);
    }

    public function test_non_admin_gets_403(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson('/api/admin/dashboard/analytics/sales?period=daily');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_gets_401(): void
    {
        $response = $this->getJson('/api/admin/dashboard/analytics/sales?period=daily');

        $response->assertStatus(401);
    }

    public function test_invalid_period_returns_422(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/analytics/sales?period=yearly');

        $response->assertStatus(422);
    }

    public function test_missing_period_returns_422(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/analytics/sales');

        $response->assertStatus(422);
    }

    public function test_daily_sales_returns_correct_data(): void
    {
        $this->createDeliveredOrder('1500.00', '2026-09-10 10:00:00');
        $this->createDeliveredOrder('2500.00', '2026-09-10 14:00:00');
        $this->createDeliveredOrder('3000.00', '2026-09-12 09:00:00');

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/analytics/sales?period=daily');

        $response->assertOk();
        $response->assertJsonFragment(['period' => 'daily']);
        $response->assertJsonStructure([
            'success',
            'period',
            'currency_code',
            'currency_symbol',
            'summary' => ['total_sales', 'total_orders', 'average_order_value'],
            'points' => [
                '*' => ['label', 'date', 'sales', 'orders'],
            ],
        ]);

        $data = $response->json('summary');
        $this->assertEquals(7000.0, $data['total_sales']);
        $this->assertEquals(3, $data['total_orders']);
    }

    public function test_weekly_sales_returns_12_weeks(): void
    {
        $this->createDeliveredOrder('2000.00', '2026-08-18 10:00:00');

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/analytics/sales?period=weekly');

        $response->assertOk();
        $response->assertJsonFragment(['period' => 'weekly']);

        $points = $response->json('points');
        $this->assertCount(12, $points);
    }

    public function test_monthly_sales_returns_12_months(): void
    {
        $this->createDeliveredOrder('5000.00', '2026-05-15 10:00:00');

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/analytics/sales?period=monthly');

        $response->assertOk();
        $response->assertJsonFragment(['period' => 'monthly']);

        $points = $response->json('points');
        $this->assertCount(12, $points);
    }

    public function test_only_delivered_orders_are_counted(): void
    {
        $this->createDeliveredOrder('1500.00');
        $this->createOrderWithStatus('pending', '2000.00');
        $this->createOrderWithStatus('confirmed', '3000.00');
        $this->createOrderWithStatus('processing', '2500.00');
        $this->createOrderWithStatus('shipped', '1800.00');
        $this->createOrderWithStatus('cancelled', '1200.00');

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/analytics/sales?period=daily');

        $response->assertOk();

        $data = $response->json('summary');
        $this->assertEquals(1500.0, $data['total_sales']);
        $this->assertEquals(1, $data['total_orders']);
    }

    public function test_empty_dataset_returns_zero_filled_points(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/analytics/sales?period=daily');

        $response->assertOk();

        $points = $response->json('points');
        $this->assertCount(30, $points);

        foreach ($points as $point) {
            $this->assertEquals(0, $point['sales']);
            $this->assertEquals(0, $point['orders']);
        }
    }

    public function test_response_includes_currency_from_site_settings(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/analytics/sales?period=daily');

        $response->assertOk();
        $response->assertJsonFragment([
            'currency_code' => 'NPR',
            'currency_symbol' => 'NPR',
        ]);
    }

    public function test_average_order_value_is_calculated_correctly(): void
    {
        $this->createDeliveredOrder('1000.00');
        $this->createDeliveredOrder('2000.00');

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/analytics/sales?period=daily');

        $response->assertOk();

        $data = $response->json('summary');
        $this->assertEquals(1500.0, $data['average_order_value']);
    }
}
