<?php

namespace Tests\Feature;

use App\Enums\CartStatus;
use App\Models\Cart;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
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

    private function createOrderItem(Order $order, string $productName, string $variantName, int $quantity, string $subtotal): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'title' => $productName,
            'status' => 'active',
        ]);
        $variant = ProductVariant::factory()->create([
            'product_id' => $product->id,
            'name' => $variantName,
            'price' => $subtotal,
            'stock' => 50,
            'status' => 'active',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_variant_id' => $variant->id,
            'product_name' => $productName,
            'variant_name' => $variantName,
            'quantity' => $quantity,
            'unit_price' => $subtotal,
            'subtotal' => $subtotal,
        ]);
    }

    // ── Sales Analytics Tests ──────────────────────────

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

    public function test_weekly_sales_does_not_double_count_boundary_orders(): void
    {
        \Illuminate\Support\Carbon::setTestNow('2026-09-15 17:00:00');

        $this->createDeliveredOrder('350.00', '2026-09-13 14:00:00');

        $daily = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/analytics/sales?period=daily');
        $weekly = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/analytics/sales?period=weekly');
        $monthly = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/analytics/sales?period=monthly');

        \Illuminate\Support\Carbon::setTestNow();

        $daily->assertOk();
        $weekly->assertOk();
        $monthly->assertOk();

        $this->assertEquals(350.0, $daily->json('summary.total_sales'));
        $this->assertEquals(1, $daily->json('summary.total_orders'));

        $this->assertEquals(350.0, $weekly->json('summary.total_sales'));
        $this->assertEquals(1, $weekly->json('summary.total_orders'));

        $this->assertEquals(350.0, $monthly->json('summary.total_sales'));
        $this->assertEquals(1, $monthly->json('summary.total_orders'));
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

    // ── Dashboard Overview Tests ───────────────────────

    public function test_overview_non_admin_gets_403(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson('/api/admin/dashboard/overview');

        $response->assertStatus(403);
    }

    public function test_overview_returns_all_sections(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/overview');

        $response->assertOk();
        $response->assertJsonStructure([
            'success',
            'today_date',
            'currency_code',
            'currency_symbol',
            'kpis' => [
                'today_sales', 'today_sales_change',
                'today_orders', 'today_orders_change',
                'month_sales', 'month_sales_change',
                'total_customers', 'new_customers_this_month', 'customer_growth_pct',
                'average_order_value', 'aov_change',
            ],
            'order_status' => ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
            'recent_orders',
            'top_products',
            'low_stock',
        ]);
    }

    public function test_overview_order_status_zero_fills_missing(): void
    {
        // Create no orders — all statuses should be 0
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/overview');

        $response->assertOk();

        $status = $response->json('order_status');
        $this->assertEquals(0, $status['pending']);
        $this->assertEquals(0, $status['confirmed']);
        $this->assertEquals(0, $status['processing']);
        $this->assertEquals(0, $status['shipped']);
        $this->assertEquals(0, $status['delivered']);
        $this->assertEquals(0, $status['cancelled']);
    }

    public function test_overview_order_status_counts_all_six(): void
    {
        $this->createOrderWithStatus('pending');
        $this->createOrderWithStatus('pending');
        $this->createOrderWithStatus('confirmed');
        $this->createOrderWithStatus('processing');
        $this->createOrderWithStatus('shipped');
        $this->createOrderWithStatus('delivered');
        $this->createOrderWithStatus('delivered');
        $this->createOrderWithStatus('delivered');
        $this->createOrderWithStatus('cancelled');

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/overview');

        $response->assertOk();

        $status = $response->json('order_status');
        $this->assertEquals(2, $status['pending']);
        $this->assertEquals(1, $status['confirmed']);
        $this->assertEquals(1, $status['processing']);
        $this->assertEquals(1, $status['shipped']);
        $this->assertEquals(3, $status['delivered']);
        $this->assertEquals(1, $status['cancelled']);
    }

    public function test_overview_recent_orders_includes_id(): void
    {
        $order = $this->createDeliveredOrder('1500.00');

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/overview');

        $response->assertOk();

        $recent = $response->json('recent_orders');
        $this->assertNotEmpty($recent);
        $this->assertArrayHasKey('id', $recent[0]);
        $this->assertArrayHasKey('order_number', $recent[0]);
        $this->assertArrayHasKey('status', $recent[0]);
    }

    public function test_overview_top_products_from_delivered_only(): void
    {
        // Delivered order with items
        $delivered = $this->createDeliveredOrder('5000.00');
        $this->createOrderItem($delivered, 'Mango Achar 500g', '500g Jar', 10, '5000.00');

        // Pending order with items (should not appear)
        $pending = $this->createOrderWithStatus('pending', '3000.00');
        $this->createOrderItem($pending, 'Mixed Achar 250g', '250g Jar', 5, '3000.00');

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/overview');

        $response->assertOk();

        $topProducts = $response->json('top_products');
        $this->assertCount(1, $topProducts);
        $this->assertEquals('Mango Achar 500g', $topProducts[0]['product_name']);
        $this->assertEquals(10, $topProducts[0]['units_sold']);
        $this->assertEquals(5000.0, (float) $topProducts[0]['revenue']);
    }

    public function test_overview_empty_database_returns_zeros(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/overview');

        $response->assertOk();

        $kpis = $response->json('kpis');
        $this->assertEquals(0, $kpis['today_sales']);
        $this->assertEquals(0, $kpis['today_orders']);
        $this->assertEquals(0, $kpis['month_sales']);
        $this->assertEquals(0, $kpis['total_customers']);
        $this->assertEquals(0, $kpis['average_order_value']);

        $this->assertEmpty($response->json('recent_orders'));
        $this->assertEmpty($response->json('top_products'));
        $this->assertEmpty($response->json('low_stock'));
    }

    public function test_overview_includes_currency_and_date(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/overview');

        $response->assertOk();
        $response->assertJsonFragment([
            'currency_code' => 'NPR',
            'currency_symbol' => 'NPR',
        ]);
        $this->assertNotEmpty($response->json('today_date'));
    }
}
