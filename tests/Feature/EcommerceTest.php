<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EcommerceTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;

    protected $customer;

    protected $product;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test user and customer
        $this->user = User::factory()->create();
        $this->customer = Customer::factory()->create();

        // Create test product
        $this->product = Product::factory()->create([
            'name' => 'Test Product',
            'price' => 100.00,
            'stock_quantity' => 10,
        ]);

        // Authenticate user
        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function test_product_exploration_and_filtering()
    {
        // Create additional products for filtering
        Product::factory()->create(['name' => 'Red Flower', 'price' => 50.00]);
        Product::factory()->create(['name' => 'Blue Flower', 'price' => 75.00]);
        Product::factory()->create(['name' => 'Yellow Flower', 'price' => 125.00]);

        // Test product listing
        $response = $this->getJson('/api/products');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'price',
                        'stock_quantity',
                    ],
                ],
            ]);

        // Test product filtering by price range
        $response = $this->getJson('/api/products?min_price=60&max_price=100');
        $response->assertStatus(200);
        $products = $response->json('data');
        foreach ($products as $product) {
            $this->assertGreaterThanOrEqual(60, $product['price']);
            $this->assertLessThanOrEqual(100, $product['price']);
        }

        // Test product search
        $response = $this->getJson('/api/products?search=Red');
        $response->assertStatus(200);
        $products = $response->json('data');
        $this->assertGreaterThan(0, count($products));
        $this->assertStringContainsString('Red', $products[0]['name']);
    }

    /** @test */
    public function test_add_to_cart_functionality()
    {
        // Test adding product to cart
        $response = $this->postJson('/api/cart/add', [
            'product_id' => $this->product->id,
            'quantity' => 2,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Product added to cart',
            ]);

        // Verify cart was created and item added
        $cart = Cart::where('customer_id', $this->customer->id)->first();
        $this->assertNotNull($cart);
        $this->assertEquals(2, $cart->item_count);
        $this->assertEquals(200.00, $cart->subtotal);
    }

    /** @test */
    public function test_cart_management_scenarios()
    {
        // Create cart with items
        $cart = Cart::create([
            'customer_id' => $this->customer->id,
            'subtotal' => 0,
            'tax' => 0,
            'shipping' => 0,
            'total' => 0,
        ]);

        $cartItem = $cart->addItem($this->product->id, 3);

        // Test cart retrieval
        $response = $this->getJson('/api/cart');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'cart' => [
                    'id',
                    'items',
                    'subtotal',
                    'tax',
                    'shipping',
                    'total',
                    'item_count',
                ],
            ]);

        // Test updating cart item quantity
        $response = $this->postJson('/api/cart/update', [
            'item_id' => $cartItem->id,
            'quantity' => 5,
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $cartItem->refresh();
        $this->assertEquals(5, $cartItem->quantity);

        // Test removing item from cart
        $response = $this->postJson('/api/cart/remove', [
            'item_id' => $cartItem->id,
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('cart_items', ['id' => $cartItem->id]);

        // Test clearing entire cart
        $cart->addItem($this->product->id, 2);
        $response = $this->postJson('/api/cart/clear');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $cart->refresh();
        $this->assertTrue($cart->is_empty);
    }

    /** @test */
    public function test_checkout_flow_with_card_payment()
    {
        // Create cart with items
        $cart = Cart::create(['customer_id' => $this->customer->id]);
        $cart->addItem($this->product->id, 2);

        // Create shipping address
        $address = $this->customer->addresses()->create([
            'name' => 'John Doe',
            'phone' => '+1234567890',
            'address_line_1' => '123 Test St',
            'city' => 'Test City',
            'state' => 'Test State',
            'postal_code' => '12345',
            'country' => 'Test Country',
        ]);

        // Test order creation
        $response = $this->postJson('/api/orders', [
            'shipping_address_id' => $address->id,
            'payment_method' => 'card',
            'notes' => 'Test order notes',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'order' => [
                    'id',
                    'order_number',
                    'total',
                    'status',
                    'payment_method',
                ],
            ]);

        $orderId = $response->json('order.id');
        $order = Order::find($orderId);

        // Verify order was created correctly
        $this->assertEquals($this->customer->id, $order->customer_id);
        $this->assertEquals('card', $order->payment_method);
        $this->assertEquals(Order::STATUS_PENDING, $order->status);

        // Test payment processing
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

        $response->assertStatus(200)
            ->assertJsonStructure([
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
    }

    /** @test */
    public function test_checkout_flow_with_cash_on_delivery()
    {
        // Create cart with items
        $cart = Cart::create(['customer_id' => $this->customer->id]);
        $cart->addItem($this->product->id, 1);

        // Test order creation with cash on delivery
        $response = $this->postJson('/api/orders', [
            'payment_method' => 'cash_on_delivery',
            'shipping_address' => [
                'name' => 'Jane Doe',
                'phone' => '+1234567890',
                'address_line_1' => '456 Test Ave',
                'city' => 'Test City',
                'state' => 'Test State',
                'postal_code' => '54321',
                'country' => 'Test Country',
            ],
        ]);

        $response->assertStatus(201);
        $orderId = $response->json('order.id');

        // Test payment processing for COD
        $response = $this->postJson('/api/payments/process', [
            'order_id' => $orderId,
            'payment_method' => 'cash_on_delivery',
        ]);

        $response->assertStatus(200);

        // Verify COD payment was created
        $payment = Payment::where('order_id', $orderId)->first();
        $this->assertNotNull($payment);
        $this->assertEquals('cash_on_delivery', $payment->payment_method);
        $this->assertEquals(Payment::STATUS_PENDING, $payment->status);
    }

    /** @test */
    public function test_order_processing_and_confirmation()
    {
        // Create order
        $order = Order::factory()->create([
            'customer_id' => $this->customer->id,
            'status' => Order::STATUS_PENDING,
        ]);

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $this->product->id,
        ]);

        // Test order retrieval
        $response = $this->getJson("/api/orders/{$order->id}");
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'order' => [
                    'id',
                    'order_number',
                    'status',
                    'items',
                    'payments',
                ],
            ]);

        // Test order status updates
        $order->updateStatus(Order::STATUS_CONFIRMED);
        $this->assertEquals(Order::STATUS_CONFIRMED, $order->fresh()->status);

        $order->updateStatus(Order::STATUS_SHIPPED);
        $this->assertEquals(Order::STATUS_SHIPPED, $order->fresh()->status);
        $this->assertNotNull($order->fresh()->shipped_at);

        // Test order cancellation
        $pendingOrder = Order::factory()->create([
            'customer_id' => $this->customer->id,
            'status' => Order::STATUS_PENDING,
        ]);

        $response = $this->postJson("/api/orders/{$pendingOrder->id}/cancel");
        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertEquals(Order::STATUS_CANCELLED, $pendingOrder->fresh()->status);
    }

    /** @test */
    public function test_customer_profile_management()
    {
        // Test profile retrieval
        $response = $this->getJson('/api/profile');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'user' => [
                    'id',
                    'name',
                    'phone_number',
                ],
            ]);

        // Test profile update
        $response = $this->putJson('/api/profile', [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('Updated Name', $this->customer->fresh()->name);

        // Test address management
        $response = $this->postJson('/api/profile/addresses', [
            'name' => 'Test Address',
            'phone' => '+1234567890',
            'address_line_1' => '789 New St',
            'city' => 'New City',
            'state' => 'New State',
            'postal_code' => '67890',
            'country' => 'New Country',
        ]);

        $response->assertStatus(200);
        $addressId = $response->json('address.id');

        // Test address update
        $response = $this->putJson("/api/profile/addresses/{$addressId}", [
            'name' => 'Updated Address Name',
        ]);

        $response->assertStatus(200);

        // Test address deletion
        $response = $this->deleteJson("/api/profile/addresses/{$addressId}");
        $response->assertStatus(200);

        $this->assertDatabaseMissing('customer_adresses', ['id' => $addressId]);
    }

    /** @test */
    public function test_order_history_and_tracking()
    {
        // Create multiple orders
        $orders = Order::factory()->count(3)->create([
            'customer_id' => $this->customer->id,
        ]);

        // Test order history
        $response = $this->getJson('/api/orders');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'orders',
                'pagination',
            ]);

        $responseOrders = $response->json('orders');
        $this->assertCount(3, $responseOrders);

        // Test order tracking
        $order = $orders->first();
        $response = $this->getJson("/api/orders/tracking/{$order->order_number}");
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'tracking' => [
                    'order_number',
                    'status',
                    'created_at',
                ],
            ]);
    }

    /** @test */
    public function test_payment_refund_functionality()
    {
        // Create order with successful payment
        $order = Order::factory()->create([
            'customer_id' => $this->customer->id,
        ]);

        $payment = Payment::factory()->create([
            'order_id' => $order->id,
            'status' => Payment::STATUS_COMPLETED,
            'amount' => 100.00,
        ]);

        // Test payment refund
        $response = $this->postJson("/api/payments/{$payment->id}/refund", [
            'amount' => 50.00,
            'reason' => 'Partial refund requested',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        // Verify refund was processed
        $refundPayment = Payment::where('order_id', $order->id)
            ->where('amount', '<', 0)
            ->first();
        $this->assertNotNull($refundPayment);
        $this->assertEquals(-50.00, $refundPayment->amount);
    }

    /** @test */
    public function test_cart_calculations_and_totals()
    {
        $cart = Cart::create(['customer_id' => $this->customer->id]);

        // Add multiple items
        $cart->addItem($this->product->id, 2); // 2 * 100 = 200

        $product2 = Product::factory()->create(['price' => 50.00]);
        $cart->addItem($product2->id, 3); // 3 * 50 = 150

        $cart->calculateTotals();

        // Verify calculations
        $this->assertEquals(350.00, $cart->subtotal); // 200 + 150
        $this->assertEquals(52.50, $cart->tax); // 15% of 350
        $this->assertEquals(0, $cart->shipping); // Free shipping over threshold
        $this->assertEquals(402.50, $cart->total); // 350 + 52.50 + 0

        // Test with discount
        $cart->applyDiscount(50.00);
        $this->assertEquals(352.50, $cart->fresh()->total); // 402.50 - 50
    }

    /** @test */
    public function test_inventory_management()
    {
        // Test stock validation when adding to cart
        $lowStockProduct = Product::factory()->create([
            'stock_quantity' => 2,
            'price' => 25.00,
        ]);

        $cart = Cart::create(['customer_id' => $this->customer->id]);

        // Should succeed with available stock
        $item = $cart->addItem($lowStockProduct->id, 2);
        $this->assertNotNull($item);

        // Test order creation reduces stock (if implemented)
        $order = Order::createFromCart($cart, $this->customer->id);
        $this->assertNotNull($order);
    }

    /** @test */
    public function test_error_handling_scenarios()
    {
        // Test adding non-existent product to cart
        $response = $this->postJson('/api/cart/add', [
            'product_id' => 99999,
            'quantity' => 1,
        ]);

        $response->assertStatus(422);

        // Test accessing order without authentication
        $this->withoutMiddleware();
        $response = $this->getJson('/api/orders');
        $response->assertStatus(401);

        // Test invalid payment data
        Sanctum::actingAs($this->user);
        $order = Order::factory()->create(['customer_id' => $this->customer->id]);

        $response = $this->postJson('/api/payments/process', [
            'order_id' => $order->id,
            'payment_method' => 'invalid_method',
        ]);

        $response->assertStatus(422);
    }
}
