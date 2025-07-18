<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = session('cart', []);
        $cartTotal = 0;
        $cartCount = 0;

        foreach ($cart as $item) {
            $cartTotal += $item['price'] * $item['quantity'];
            $cartCount += $item['quantity'];
        }

        return response()->json([
            'cart' => $cart,
            'cart_total' => $cartTotal,
            'cart_count' => $cartCount,
            'shipping_cost' => $cartTotal > 500 ? 0 : 50, // Free shipping over 500 SAR
            'tax_rate' => 0.15, // 15% VAT
        ]);
    }

    public function process(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_info.name' => 'required|string|max:255',
            'customer_info.email' => 'required|email|max:255',
            'customer_info.phone' => 'required|string|max:20',
            'customer_info.address' => 'required|string|max:500',
            'customer_info.city' => 'required|string|max:100',
            'customer_info.postal_code' => 'nullable|string|max:10',
            'payment_method' => 'required|in:cash_on_delivery,credit_card,bank_transfer',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $cart = session('cart', []);
        
        if (empty($cart)) {
            return response()->json([
                'success' => false,
                'message' => 'Cart is empty'
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Calculate totals
            $subtotal = 0;
            foreach ($cart as $item) {
                $subtotal += $item['price'] * $item['quantity'];
            }
            
            $shippingCost = $subtotal > 500 ? 0 : 50;
            $taxAmount = $subtotal * 0.15;
            $total = $subtotal + $shippingCost + $taxAmount;

            // Create or get customer
            $customerData = $request->input('customer_info');
            $customer = Customer::updateOrCreate(
                ['email' => $customerData['email']],
                [
                    'name' => $customerData['name'],
                    'phone' => $customerData['phone'],
                    'address' => $customerData['address'],
                    'user_id' => Auth::id(),
                ]
            );

            // Create order
            $order = Order::create([
                'customer_id' => $customer->id,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'tax_amount' => $taxAmount,
                'total' => $total,
                'status' => 'pending',
                'payment_method' => $request->input('payment_method'),
                'notes' => $request->input('notes'),
                'order_number' => 'ORD-' . date('Ymd') . '-' . rand(1000, 9999),
            ]);

            // Create order items
            foreach ($cart as $productId => $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $productId,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['price'] * $item['quantity'],
                ]);

                // Update product stock
                $product = Product::find($productId);
                if ($product && $product->stock >= $item['quantity']) {
                    $product->decrement('stock', $item['quantity']);
                }
            }

            // Clear cart
            session()->forget('cart');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total' => $order->total,
                    'status' => $order->status,
                    'estimated_delivery' => now()->addDays(3)->format('Y-m-d'),
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to process order. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getOrderStatus(Request $request)
    {
        $orderNumber = $request->input('order_number');
        
        $order = Order::with(['customer', 'orderItems.product'])
                     ->where('order_number', $orderNumber)
                     ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order,
        ]);
    }

    public function getPaymentMethods()
    {
        $paymentMethods = [
            [
                'id' => 'cash_on_delivery',
                'name_ar' => 'الدفع عند الاستلام',
                'name_en' => 'Cash on Delivery',
                'description_ar' => 'ادفع عند استلام طلبك',
                'description_en' => 'Pay when you receive your order',
                'fee' => 0,
                'available' => true,
            ],
            [
                'id' => 'credit_card',
                'name_ar' => 'بطاقة ائتمانية',
                'name_en' => 'Credit Card',
                'description_ar' => 'ادفع بأمان باستخدام بطاقتك الائتمانية',
                'description_en' => 'Pay securely using your credit card',
                'fee' => 0,
                'available' => true,
            ],
            [
                'id' => 'bank_transfer',
                'name_ar' => 'تحويل بنكي',
                'name_en' => 'Bank Transfer',
                'description_ar' => 'حول المبلغ إلى حسابنا البنكي',
                'description_en' => 'Transfer the amount to our bank account',
                'fee' => 0,
                'available' => true,
            ],
        ];

        return response()->json([
            'payment_methods' => $paymentMethods,
        ]);
    }
}
