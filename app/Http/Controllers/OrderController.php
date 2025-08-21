<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    /**
     * Get customer orders
     */
    public function index(Request $request)
    {
        try {
            $customer = $this->getAuthenticatedCustomer();

            if (! $customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            $orders = $customer->orders()
                ->with(['orderItems.product', 'payments', 'shippingAddress'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'orders' => $orders->items(),
                'pagination' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'per_page' => $orders->perPage(),
                    'total' => $orders->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve orders',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get specific order details
     */
    public function show(Request $request, $id)
    {
        try {
            $customer = $this->getAuthenticatedCustomer();

            if (! $customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            $order = $customer->orders()
                ->with(['orderItems.product', 'payments', 'shippingAddress'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'status_label' => $order->status_label,
                    'subtotal' => $order->subtotal,
                    'tax_amount' => $order->tax_amount,
                    'shipping_amount' => $order->shipping_amount,
                    'discount_amount' => $order->discount_amount,
                    'total' => $order->total,
                    'payment_method' => $order->payment_method,
                    'payment_status' => $order->payment_status,
                    'is_paid' => $order->is_paid,
                    'can_be_cancelled' => $order->can_be_cancelled,
                    'tracking_number' => $order->tracking_number,
                    'created_at' => $order->created_at,
                    'shipped_at' => $order->shipped_at,
                    'delivered_at' => $order->delivered_at,
                    'items' => $order->orderItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_id' => $item->product_id,
                            'product' => [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'image' => $item->product->getFirstMediaUrl('products') ?: '/assets/images/placeholder-product.jpg',
                                'slug' => $item->product->slug ?? null,
                            ],
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                            'total' => $item->total,
                        ];
                    }),
                    'shipping_address' => $order->shippingAddress ? [
                        'id' => $order->shippingAddress->id,
                        'name' => $order->shippingAddress->name,
                        'phone' => $order->shippingAddress->phone,
                        'address_line_1' => $order->shippingAddress->address_line_1,
                        'address_line_2' => $order->shippingAddress->address_line_2,
                        'city' => $order->shippingAddress->city,
                        'state' => $order->shippingAddress->state,
                        'postal_code' => $order->shippingAddress->postal_code,
                        'country' => $order->shippingAddress->country,
                    ] : null,
                    'payments' => $order->payments->map(function ($payment) {
                        return [
                            'id' => $payment->id,
                            'amount' => $payment->amount,
                            'status' => $payment->status,
                            'status_label' => $payment->status_label,
                            'payment_method' => $payment->payment_method,
                            'payment_method_label' => $payment->payment_method_label,
                            'transaction_id' => $payment->transaction_id,
                            'processed_at' => $payment->processed_at,
                        ];
                    }),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create order from cart
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'shipping_address_id' => 'nullable|exists:customer_adresses,id',
                'payment_method' => 'required|in:card,cash_on_delivery',
                'shipping_address' => 'required_without:shipping_address_id|array',
                'shipping_address.name' => 'required_with:shipping_address|string|max:255',
                'shipping_address.phone' => 'required_with:shipping_address|string|max:20',
                'shipping_address.address_line_1' => 'required_with:shipping_address|string|max:255',
                'shipping_address.address_line_2' => 'nullable|string|max:255',
                'shipping_address.city' => 'required_with:shipping_address|string|max:100',
                'shipping_address.state' => 'required_with:shipping_address|string|max:100',
                'shipping_address.postal_code' => 'required_with:shipping_address|string|max:20',
                'shipping_address.country' => 'required_with:shipping_address|string|max:100',
                'notes' => 'nullable|string|max:1000',
            ]);

            $customer = $this->getAuthenticatedCustomer();

            if (! $customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            // Get customer's active cart
            $cart = $customer->active_cart;

            if (! $cart || $cart->is_empty) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart is empty',
                ], 400);
            }

            DB::beginTransaction();

            try {
                // Handle shipping address
                $shippingAddressId = $request->input('shipping_address_id');

                if (! $shippingAddressId && $request->has('shipping_address')) {
                    $address = $customer->addresses()->create($request->input('shipping_address'));
                    $shippingAddressId = $address->id;
                }

                // Create order from cart
                $order = Order::createFromCart(
                    $cart,
                    $customer->id,
                    $shippingAddressId,
                    $request->input('payment_method')
                );

                if ($request->has('notes')) {
                    $order->update(['notes' => $request->input('notes')]);
                }

                // Clear the cart after successful order creation
                $cart->clear();

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Order created successfully',
                    'order' => [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'total' => $order->total,
                        'status' => $order->status,
                        'payment_method' => $order->payment_method,
                    ],
                ], 201);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cancel an order
     */
    public function cancel(Request $request, $id)
    {
        try {
            $customer = $this->getAuthenticatedCustomer();

            if (! $customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            $order = $customer->orders()->findOrFail($id);

            if (! $order->can_be_cancelled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order cannot be cancelled',
                ], 400);
            }

            $order->updateStatus(Order::STATUS_CANCELLED, 'Cancelled by customer');

            return response()->json([
                'success' => true,
                'message' => 'Order cancelled successfully',
                'order' => [
                    'id' => $order->id,
                    'status' => $order->status,
                    'status_label' => $order->status_label,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get order tracking information
     */
    public function tracking(Request $request, $orderNumber)
    {
        try {
            $order = Order::where('order_number', $orderNumber)->firstOrFail();

            return response()->json([
                'success' => true,
                'tracking' => [
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'status_label' => $order->status_label,
                    'tracking_number' => $order->tracking_number,
                    'created_at' => $order->created_at,
                    'shipped_at' => $order->shipped_at,
                    'delivered_at' => $order->delivered_at,
                    'estimated_delivery' => $order->shipped_at ?
                        $order->shipped_at->addDays(3)->format('Y-m-d') : null,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Get authenticated customer
     */
    private function getAuthenticatedCustomer()
    {
        if (Auth::guard('sanctum')->check()) {
            $user = Auth::guard('sanctum')->user();

            return $user->customer;
        }

        return null;
    }
}
