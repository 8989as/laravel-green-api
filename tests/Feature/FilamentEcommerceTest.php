<?php

namespace Tests\Feature;

use App\Filament\Resources\CustomerResource;
use App\Filament\Resources\DiscountResource;
use App\Filament\Resources\OrderResource;
use App\Filament\Resources\PaymentResource;
use App\Models\Customer;
use App\Models\Discount;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class FilamentEcommerceTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin user
        $this->adminUser = User::factory()->create([
            'email' => 'admin@test.com',
            'is_admin' => true,
        ]);

        $this->actingAs($this->adminUser);
    }

    /** @test */
    public function test_order_resource_management()
    {
        // Create test data
        $customer = Customer::factory()->create();
        $product = Product::factory()->create();
        $order = Order::factory()->create([
            'customer_id' => $customer->id,
            'status' => Order::STATUS_PENDING,
        ]);

        // Test order listing
        Livewire::test(OrderResource\Pages\ListOrders::class)
            ->assertCanSeeTableRecords([$order])
            ->assertCanRenderTableColumn('order_number')
            ->assertCanRenderTableColumn('customer.name')
            ->assertCanRenderTableColumn('status')
            ->assertCanRenderTableColumn('total')
            ->assertCanRenderTableColumn('created_at');

        // Test order filtering by status
        Livewire::test(OrderResource\Pages\ListOrders::class)
            ->filterTable('status', Order::STATUS_PENDING)
            ->assertCanSeeTableRecords([$order]);

        // Test order view
        Livewire::test(OrderResource\Pages\ViewOrder::class, [
            'record' => $order->getRouteKey(),
        ])
            ->assertSuccessful()
            ->assertSee($order->order_number)
            ->assertSee($order->customer->name);

        // Test order editing
        Livewire::test(OrderResource\Pages\EditOrder::class, [
            'record' => $order->getRouteKey(),
        ])
            ->assertFormSet([
                'status' => $order->status,
                'notes' => $order->notes,
            ])
            ->fillForm([
                'status' => Order::STATUS_CONFIRMED,
                'notes' => 'Updated by admin',
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $order->refresh();
        $this->assertEquals(Order::STATUS_CONFIRMED, $order->status);
        $this->assertEquals('Updated by admin', $order->notes);
    }

    /** @test */
    public function test_payment_resource_management()
    {
        // Create test data
        $customer = Customer::factory()->create();
        $order = Order::factory()->create(['customer_id' => $customer->id]);
        $payment = Payment::factory()->create([
            'order_id' => $order->id,
            'status' => Payment::STATUS_PENDING,
        ]);

        // Test payment listing
        Livewire::test(PaymentResource\Pages\ListPayments::class)
            ->assertCanSeeTableRecords([$payment])
            ->assertCanRenderTableColumn('order.order_number')
            ->assertCanRenderTableColumn('amount')
            ->assertCanRenderTableColumn('payment_method')
            ->assertCanRenderTableColumn('status')
            ->assertCanRenderTableColumn('processed_at');

        // Test payment filtering by status
        Livewire::test(PaymentResource\Pages\ListPayments::class)
            ->filterTable('status', Payment::STATUS_PENDING)
            ->assertCanSeeTableRecords([$payment]);

        // Test payment view
        Livewire::test(PaymentResource\Pages\ViewPayment::class, [
            'record' => $payment->getRouteKey(),
        ])
            ->assertSuccessful()
            ->assertSee($payment->order->order_number)
            ->assertSee($payment->formatted_amount);

        // Test payment editing
        Livewire::test(PaymentResource\Pages\EditPayment::class, [
            'record' => $payment->getRouteKey(),
        ])
            ->assertFormSet([
                'status' => $payment->status,
            ])
            ->fillForm([
                'status' => Payment::STATUS_COMPLETED,
                'processed_at' => now(),
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $payment->refresh();
        $this->assertEquals(Payment::STATUS_COMPLETED, $payment->status);
    }

    /** @test */
    public function test_customer_resource_management()
    {
        // Create test data
        $customer = Customer::factory()->create([
            'name' => 'John Doe',
            'phone_number' => '+1234567890',
        ]);

        // Create some orders for the customer
        Order::factory()->count(3)->create(['customer_id' => $customer->id]);

        // Test customer listing
        Livewire::test(CustomerResource\Pages\ListCustomers::class)
            ->assertCanSeeTableRecords([$customer])
            ->assertCanRenderTableColumn('name')
            ->assertCanRenderTableColumn('phone_number')
            ->assertCanRenderTableColumn('created_at');

        // Test customer search
        Livewire::test(CustomerResource\Pages\ListCustomers::class)
            ->searchTable('John')
            ->assertCanSeeTableRecords([$customer]);

        // Test customer view
        Livewire::test(CustomerResource\Pages\ViewCustomer::class, [
            'record' => $customer->getRouteKey(),
        ])
            ->assertSuccessful()
            ->assertSee($customer->name)
            ->assertSee($customer->phone_number);

        // Test customer editing
        Livewire::test(CustomerResource\Pages\EditCustomer::class, [
            'record' => $customer->getRouteKey(),
        ])
            ->assertFormSet([
                'name' => $customer->name,
                'phone_number' => $customer->phone_number,
            ])
            ->fillForm([
                'name' => 'Jane Doe',
                'phone_number' => '+0987654321',
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $customer->refresh();
        $this->assertEquals('Jane Doe', $customer->name);
        $this->assertEquals('+0987654321', $customer->phone_number);
    }

    /** @test */
    public function test_discount_resource_management()
    {
        // Create test data
        $discount = Discount::factory()->create([
            'code' => 'SAVE20',
            'type' => 'percentage',
            'value' => 20,
            'is_active' => true,
        ]);

        // Test discount listing
        Livewire::test(DiscountResource\Pages\ListDiscounts::class)
            ->assertCanSeeTableRecords([$discount])
            ->assertCanRenderTableColumn('code')
            ->assertCanRenderTableColumn('type')
            ->assertCanRenderTableColumn('value')
            ->assertCanRenderTableColumn('is_active');

        // Test discount creation
        Livewire::test(DiscountResource\Pages\CreateDiscount::class)
            ->fillForm([
                'code' => 'NEWDISCOUNT',
                'type' => 'fixed',
                'value' => 50,
                'is_active' => true,
                'starts_at' => now(),
                'expires_at' => now()->addDays(30),
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $this->assertDatabaseHas('discounts', [
            'code' => 'NEWDISCOUNT',
            'type' => 'fixed',
            'value' => 50,
        ]);

        // Test discount editing
        Livewire::test(DiscountResource\Pages\EditDiscount::class, [
            'record' => $discount->getRouteKey(),
        ])
            ->assertFormSet([
                'code' => $discount->code,
                'type' => $discount->type,
                'value' => $discount->value,
            ])
            ->fillForm([
                'value' => 25,
                'is_active' => false,
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $discount->refresh();
        $this->assertEquals(25, $discount->value);
        $this->assertFalse($discount->is_active);
    }

    /** @test */
    public function test_order_bulk_actions()
    {
        // Create multiple orders
        $orders = Order::factory()->count(3)->create([
            'status' => Order::STATUS_PENDING,
        ]);

        // Test bulk status update
        Livewire::test(OrderResource\Pages\ListOrders::class)
            ->selectTableRecords($orders->pluck('id')->toArray())
            ->callTableBulkAction('updateStatus', [
                'status' => Order::STATUS_CONFIRMED,
            ]);

        // Verify all orders were updated
        foreach ($orders as $order) {
            $this->assertEquals(Order::STATUS_CONFIRMED, $order->fresh()->status);
        }
    }

    /** @test */
    public function test_payment_bulk_actions()
    {
        // Create multiple payments
        $payments = Payment::factory()->count(3)->create([
            'status' => Payment::STATUS_PENDING,
        ]);

        // Test bulk status update
        Livewire::test(PaymentResource\Pages\ListPayments::class)
            ->selectTableRecords($payments->pluck('id')->toArray())
            ->callTableBulkAction('markAsCompleted');

        // Verify all payments were updated
        foreach ($payments as $payment) {
            $this->assertEquals(Payment::STATUS_COMPLETED, $payment->fresh()->status);
        }
    }

    /** @test */
    public function test_dashboard_widgets()
    {
        // Create test data for widgets
        Order::factory()->create(['status' => Order::STATUS_PENDING, 'total' => 100]);
        Order::factory()->create(['status' => Order::STATUS_CONFIRMED, 'total' => 200]);
        Order::factory()->create(['status' => Order::STATUS_SHIPPED, 'total' => 150]);
        Order::factory()->create(['status' => Order::STATUS_DELIVERED, 'total' => 300]);

        Payment::factory()->create(['status' => Payment::STATUS_COMPLETED, 'amount' => 250]);
        Payment::factory()->create(['status' => Payment::STATUS_PENDING, 'amount' => 100]);

        // Test EcommerceStatsWidget
        $widget = Livewire::test(\App\Filament\Widgets\EcommerceStatsWidget::class);
        $widget->assertSuccessful();

        // Test OrderStatusChartWidget
        $widget = Livewire::test(\App\Filament\Widgets\OrderStatusChartWidget::class);
        $widget->assertSuccessful();

        // Test RecentOrdersWidget
        $widget = Livewire::test(\App\Filament\Widgets\RecentOrdersWidget::class);
        $widget->assertSuccessful();

        // Test RevenueChartWidget
        $widget = Livewire::test(\App\Filament\Widgets\RevenueChartWidget::class);
        $widget->assertSuccessful();
    }

    /** @test */
    public function test_order_status_transitions()
    {
        $order = Order::factory()->create(['status' => Order::STATUS_PENDING]);

        // Test valid status transitions
        $validTransitions = [
            Order::STATUS_PENDING => Order::STATUS_CONFIRMED,
            Order::STATUS_CONFIRMED => Order::STATUS_PROCESSING,
            Order::STATUS_PROCESSING => Order::STATUS_SHIPPED,
            Order::STATUS_SHIPPED => Order::STATUS_DELIVERED,
        ];

        foreach ($validTransitions as $from => $to) {
            $order->update(['status' => $from]);

            Livewire::test(OrderResource\Pages\EditOrder::class, [
                'record' => $order->getRouteKey(),
            ])
                ->fillForm(['status' => $to])
                ->call('save')
                ->assertHasNoFormErrors();

            $this->assertEquals($to, $order->fresh()->status);
        }
    }

    /** @test */
    public function test_customer_order_history_relation()
    {
        $customer = Customer::factory()->create();
        $orders = Order::factory()->count(5)->create(['customer_id' => $customer->id]);

        // Test customer view shows order history
        Livewire::test(CustomerResource\Pages\ViewCustomer::class, [
            'record' => $customer->getRouteKey(),
        ])
            ->assertSuccessful()
            ->assertSee($orders->first()->order_number);
    }

    /** @test */
    public function test_payment_refund_functionality()
    {
        $payment = Payment::factory()->create([
            'status' => Payment::STATUS_COMPLETED,
            'amount' => 100.00,
        ]);

        // Test refund action
        Livewire::test(PaymentResource\Pages\ViewPayment::class, [
            'record' => $payment->getRouteKey(),
        ])
            ->callAction('refund', [
                'amount' => 50.00,
                'reason' => 'Customer request',
            ]);

        // Verify refund was processed
        $this->assertDatabaseHas('payments', [
            'order_id' => $payment->order_id,
            'amount' => -50.00,
            'status' => Payment::STATUS_COMPLETED,
        ]);
    }

    /** @test */
    public function test_discount_usage_tracking()
    {
        $discount = Discount::factory()->create([
            'usage_limit' => 10,
            'used_count' => 5,
        ]);

        // Test discount view shows usage statistics
        Livewire::test(DiscountResource\Pages\ViewDiscount::class, [
            'record' => $discount->getRouteKey(),
        ])
            ->assertSuccessful()
            ->assertSee('5 / 10'); // Usage display
    }

    /** @test */
    public function test_order_export_functionality()
    {
        // Create orders for export
        Order::factory()->count(10)->create();

        // Test export action
        Livewire::test(OrderResource\Pages\ListOrders::class)
            ->callAction('export')
            ->assertSuccessful();
    }

    /** @test */
    public function test_resource_permissions()
    {
        // Create non-admin user
        $regularUser = User::factory()->create(['is_admin' => false]);
        $this->actingAs($regularUser);

        // Test that non-admin users cannot access admin resources
        $this->get('/admin/orders')
            ->assertStatus(403);

        $this->get('/admin/payments')
            ->assertStatus(403);

        $this->get('/admin/customers')
            ->assertStatus(403);
    }
}
