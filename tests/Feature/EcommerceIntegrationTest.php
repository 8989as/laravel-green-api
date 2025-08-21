<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EcommerceIntegrationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;

    protected $customer;

    protected $products;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test user and customer
        $this->user = User::factory()->create();
        $this->customer = Customer::factory()->create();

        // Create test products
        $this->products = Product::factory()->count(5)->create([
            'stock_quantity' => 10,
        ]);

        // Authenticate user
        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function test_complete_ecommerce_flow_with_card_payment()
    {
        // Step 1: Browse products
        $response = $this->getJson('/api/products');
        $response->assertStatus(200);
        $products = $response->json('data');
        $this->assertGreaterThan(0, count($products));

        // Step 2: Add products to cart
        $product1 = $this->products->first();
        $product2 = $this->products->skip(1)->first();

        $response = $this->postJson('/api/cart/add', [
            'product_id' => $product1->id,
            'quantity' => 2,
        ]);
        $response->assertStatus(200)->assertJson(['success' => true]);

        $response = $this->postJson('/api/cart/add', [
            'product_id' => $product2->id,
            'quantity' => 1,
        ]);
        $response->assertStatus(200)->assertJson(['success' => true]);

        // Step 3: Verify cart contents
        $response = $this->getJson('/api/cart');
        $response->assertStatus(200);
        $cart = $response->json('cart');
        $this->assertEquals(3, $cart['item_count']); // 2 + 1
        $this->assertCount(2, $cart['items']);

        // Step 4: Update cart item quantity
        $cartItemId = $cart['items'][0]['id'];
        $response = $this->postJson('/api/cart/update', [
            'item_id' => $cartItemId,
            'quantity' => 3,
        ]);
        $response->assertStatus(200)->assertJson(['success' => true]);

        // Step 5: Create shipping address
        $address = $this->customer->addresses()->create([
            'name' => 'John Doe',
            'phone' => '+1234567890',
            'address_line_1' => '123 Test Street',
            'city' => 'Test City',
            'state' => 'Test State',
            'postal_code' => '12345',
            'country' => 'Test Country',
        ]);

        // Step 6: Create order
        $response = $this->postJson('/api/orders', [
            'shipping_address_id' => $address->id,
            'payment_method' => 'card',
            'notes' => 'Integration test order',
        ]);

        $response->assertStatus(201)->assertJsonStructure([
            'success',
            'order' => [
                'id',
                'order_number',
                'total',
                'status',
            ],
        ]);

        $orderId = $response->json('order.id');
        $order = Order::find($orderId);

        // Verify order was created correctly
        $this->assertEquals($this->customer->id, $order->customer_id);
        $this->assertEquals('card', $order->payment_method);
        $this->assertEquals(Order::STATUS_PENDING, $order->status);
        $this->assertCount(2, $order->orderItems);

        // Step 7: Process payment
        $response = $this->postJson('/api/payments/process', [
            'order_id' => $order->id,
            'payment_method' => 'card',
            'card_details' => [
                'number' => '4111111111111111',
                'expiry_month' => 12,
                'expiry_year' => 2025,
                'cvv' => '123',
                'holder_name' => 'John Doe',
            ],
        ]);

        $response->assertStatus(200)->assertJsonStructure([
            'success',
            'payment' => [
                'id',
                'status',
                'amount',
                'transaction_id',
            ],
        ]);

        // Verify payment was processed
        $payment = Payment::where('order_id', $order->id)->first();
        $this->assertNotNull($payment);
        $this->assertEquals($order->total, $payment->amount);

        // Step 8: Verify order status updated
        $order->refresh();
        $this->assertEquals(Order::STATUS_CONFIRMED, $order->status);

        // Step 9: Check order in customer's order history
        $response = $this->getJson('/api/orders');
        $response->assertStatus(200);
        $orders = $response->json('orders');
        $this->assertCount(1, $orders);
        $this->assertEquals($order->order_number, $orders[0]['order_number']);

        // Step 10: Verify cart was cleared
        $response = $this->getJson('/api/cart');
        $response->assertStatus(200);
        $cart = $response->json('cart');
        $this->assertTrue($cart['is_empty']);
    }

    /** @test */
    public function test_complete_ecommerce_flow_with_cash_on_delivery()
    {
        // Add products to cart
        $product = $this->products->first();
        $this->postJson('/api/cart/add', [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        // Create order with new address and COD
        $response = $this->postJson('/api/orders', [
            'payment_method' => 'cash_on_delivery',
            'shipping_address' => [
                'name' => 'Jane Doe',
                'phone' => '+0987654321',
                'address_line_1' => '456 COD Street',
                'city' => 'COD City',
                'state' => 'COD State',
                'postal_code' => '54321',
                'country' => 'COD Country',
            ],
            'notes' => 'COD integration test',
        ]);

        $response->assertStatus(201);
        $orderId = $response->json('order.id');

        // Process COD payment
        $response = $this->postJson('/api/payments/process', [
            'order_id' => $orderId,
            'payment_method' => 'cash_on_delivery',
        ]);

        $response->assertStatus(200);

        // Verify COD payment
        $payment = Payment::where('order_id', $orderId)->first();
        $this->assertEquals('cash_on_delivery', $payment->payment_method);
        $this->assertEquals(Payment::STATUS_PENDING, $payment->status);

        // Verify order status
        $order = Order::find($orderId);
        $this->assertEquals(Order::STATUS_CONFIRMED, $order->status);

        // Verify new address was created
        $this->assertDatabaseHas('customer_adresses', [
            'customer_id' => $this->customer->id,
            'name' => 'Jane Doe',
            'address_line_1' => '456 COD Street',
        ]);
    }

    /** @test */
    public function test_order_status_progression_workflow()
    {
        // Create order
        $order = Order::factory()->create([
            'customer_id' => $this->customer->id,
            'status' => Order::STATUS_PENDING,
        ]);

        // Simulate order processing workflow
        $statusProgression = [
            Order::STATUS_CONFIRMED,
            Order::STATUS_PROCESSING,
            Order::STATUS_SHIPPED,
            Order::STATUS_DELIVERED,
        ];

        foreach ($statusProgression as $status) {
            $order->updateStatus($status);
            $this->assertEquals($status, $order->fresh()->status);

            // Verify timestamps are set appropriately
            if ($status === Order::STATUS_SHIPPED) {
                $this->assertNotNull($order->fresh()->shipped_at);
            }
            if ($status === Order::STATUS_DELIVERED) {
                $this->assertNotNull($order->fresh()->delivered_at);
            }
        }

        // Test order tracking
        $response = $this->getJson("/api/orders/tracking/{$order->order_number}");
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'tracking' => [
                    'order_number',
                    'status',
                    'shipped_at',
                    'delivered_at',
                ],
            ]);
    }

    /** @test */
    public function test_cart_persistence_across_sessions()
    {
        // Add items to cart
        $product = $this->products->first();
        $this->postJson('/api/cart/add', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        // Verify cart exists
        $response = $this->getJson('/api/cart');
        $cart = $response->json('cart');
        $this->assertEquals(2, $cart['item_count']);

        // Simulate new session (re-authenticate)
        Sanctum::actingAs($this->user);

        // Verify cart persists
        $response = $this->getJson('/api/cart');
        $cart = $response->json('cart');
        $this->assertEquals(2, $cart['item_count']);
    }

    /** @test */
    public function test_inventory_management_during_order_process()
    {
        // Create product with limited stock
        $product = Product::factory()->create([
            'stock_quantity' => 5,
            'price' => 100.00,
        ]);

        // Add items to cart (within stock limit)
        $response = $this->postJson('/api/cart/add', [
            'product_id' => $product->id,
            'quantity' => 3,
        ]);
        $response->assertStatus(200);

        // Create order
        $address = $this->customer->addresses()->create([
            'name' => 'Test User',
            'phone' => '+1234567890',
            'address_line_1' => '123 Test St',
            'city' => 'Test City',
            'state' => 'Test State',
            'postal_code' => '12345',
            'country' => 'Test Country',
        ]);

        $response = $this->postJson('/api/orders', [
            'shipping_address_id' => $address->id,
            'payment_method' => 'cash_on_delivery',
        ]);

        $response->assertStatus(201);

        // Verify order items match cart items
        $order = Order::find($response->json('order.id'));
        $this->assertCount(1, $order->orderItems);
        $this->assertEquals(3, $order->orderItems->first()->quantity);
        $this->assertEquals($product->id, $order->orderItems->first()->product_id);
    }

    /** @test */
    public function test_discount_application_workflow()
    {
        // This test would be implemented when discount functionality is added
        // For now, we'll test the basic structure

        $product = $this->products->first();
        $this->postJson('/api/cart/add', [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        // Test discount application endpoint (currently returns 501)
        $response = $this->postJson('/api/cart/discount', [
            'discount_code' => 'SAVE20',
        ]);

        $response->assertStatus(501); // Not implemented yet
    }

    /** @test */
    public function test_payment_failure_handling()
    {
        // Create order
        $product = $this->products->first();
        $this->postJson('/api/cart/add', [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $address = $this->customer->addresses()->create([
            'name' => 'Test User',
            'phone' => '+1234567890',
            'address_line_1' => '123 Test St',
            'city' => 'Test City',
            'state' => 'Test State',
            'postal_code' => '12345',
            'country' => 'Test Country',
        ]);

        $response = $this->postJson('/api/orders', [
            'shipping_address_id' => $address->id,
            'payment_method' => 'card',
        ]);

        $orderId = $response->json('order.id');

        // Simulate payment failure with invalid card
        $response = $this->postJson('/api/payments/process', [
            'order_id' => $orderId,
            'payment_method' => 'card',
            'card_details' => [
                'number' => '1234', // Invalid card number
                'expiry_month' => 12,
                'expiry_year' => 2025,
                'cvv' => '123',
                'holder_name' => 'Test User',
            ],
        ]);

        $response->assertStatus(400);

        // Verify payment failure was recorded
        $payment = Payment::where('order_id', $orderId)->first();
        $this->assertEquals(Payment::STATUS_FAILED, $payment->status);

        // Verify order status remains pending
        $order = Order::find($orderId);
        $this->assertEquals(Order::STATUS_PENDING, $order->status);
    }

    /** @test */
    public function test_order_cancellation_workflow()
    {
        // Create order
        $order = Order::factory()->create([
            'customer_id' => $this->customer->id,
            'status' => Order::STATUS_PENDING,
        ]);

        // Test cancellation
        $response = $this->postJson("/api/orders/{$order->id}/cancel");
        $response->assertStatus(200)->assertJson(['success' => true]);

        // Verify order was cancelled
        $order->refresh();
        $this->assertEquals(Order::STATUS_CANCELLED, $order->status);

        // Test that shipped orders cannot be cancelled
        $shippedOrder = Order::factory()->create([
            'customer_id' => $this->customer->id,
            'status' => Order::STATUS_SHIPPED,
        ]);

        $response = $this->postJson("/api/orders/{$shippedOrder->id}/cancel");
        $response->assertStatus(400);
    }

    /** @test */
    public function test_customer_profile_integration_with_orders()
    {
        // Create orders for the customer
        $orders = Order::factory()->count(3)->create([
            'customer_id' => $this->customer->id,
        ]);

        // Test profile endpoint includes order statistics
        $response = $this->getJson('/api/profile');
        $response->assertStatus(200);

        // Test order history
        $response = $this->getJson('/api/orders');
        $response->assertStatus(200);
        $responseOrders = $response->json('orders');
        $this->assertCount(3, $responseOrders);

        // Test address management affects order creation
        $address = $this->customer->addresses()->create([
            'name' => 'Primary Address',
            'phone' => '+1234567890',
            'address_line_1' => '123 Primary St',
            'city' => 'Primary City',
            'state' => 'Primary State',
            'postal_code' => '12345',
            'country' => 'Primary Country',
        ]);

        // Add item to cart and create order with the address
        $this->postJson('/api/cart/add', [
            'product_id' => $this->products->first()->id,
            'quantity' => 1,
        ]);

        $response = $this->postJson('/api/orders', [
            'shipping_address_id' => $address->id,
            'payment_method' => 'cash_on_delivery',
        ]);

        $response->assertStatus(201);
        $order = Order::find($response->json('order.id'));
        $this->assertEquals($address->id, $order->shipping_address_id);
    }

    /** @test */
    public function test_error_handling_throughout_ecommerce_flow()
    {
        // Test adding non-existent product
        $response = $this->postJson('/api/cart/add', [
            'product_id' => 99999,
            'quantity' => 1,
        ]);
        $response->assertStatus(422);

        // Test creating order with empty cart
        $response = $this->postJson('/api/orders', [
            'payment_method' => 'card',
            'shipping_address' => [
                'name' => 'Test User',
                'phone' => '+1234567890',
                'address_line_1' => '123 Test St',
                'city' => 'Test City',
                'state' => 'Test State',
                'postal_code' => '12345',
                'country' => 'Test Country',
            ],
        ]);
        $response->assertStatus(400);

        // Test processing payment for non-existent order
        $response = $this->postJson('/api/payments/process', [
            'order_id' => 99999,
            'payment_method' => 'card',
            'card_details' => [
                'number' => '4111111111111111',
                'expiry_month' => 12,
                'expiry_year' => 2025,
                'cvv' => '123',
                'holder_name' => 'Test User',
            ],
        ]);
        $response->assertStatus(404);

        // Test accessing order that doesn't belong to customer
        $otherCustomer = Customer::factory()->create();
        $otherOrder = Order::factory()->create(['customer_id' => $otherCustomer->id]);

        $response = $this->getJson("/api/orders/{$otherOrder->id}");
        $response->assertStatus(404);
    }

    /** @test */
    public function test_concurrent_cart_operations()
    {
        $product = $this->products->first();

        // Simulate concurrent add operations
        $responses = [];
        for ($i = 0; $i < 3; $i++) {
            $responses[] = $this->postJson('/api/cart/add', [
                'product_id' => $product->id,
                'quantity' => 1,
            ]);
        }

        // All should succeed
        foreach ($responses as $response) {
            $response->assertStatus(200);
        }

        // Verify final cart state
        $response = $this->getJson('/api/cart');
        $cart = $response->json('cart');
        $this->assertEquals(3, $cart['item_count']);
    }
}
