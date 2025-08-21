<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    /**
     * Get payment methods available
     */
    public function methods()
    {
        return response()->json([
            'success' => true,
            'payment_methods' => [
                [
                    'id' => 'card',
                    'name' => 'Credit/Debit Card',
                    'description' => 'Pay securely with your credit or debit card',
                    'icon' => 'credit-card',
                    'enabled' => true,
                ],
                [
                    'id' => 'cash_on_delivery',
                    'name' => 'Cash on Delivery',
                    'description' => 'Pay when your order is delivered',
                    'icon' => 'cash',
                    'enabled' => true,
                ],
            ],
        ]);
    }

    /**
     * Process payment for an order
     */
    public function process(Request $request)
    {
        try {
            $request->validate([
                'order_id' => 'required|exists:orders,id',
                'payment_method' => 'required|in:card,cash_on_delivery',
                'card_details' => 'required_if:payment_method,card|array',
                'card_details.number' => 'required_with:card_details|string|min:13|max:19',
                'card_details.expiry_month' => 'required_with:card_details|integer|min:1|max:12',
                'card_details.expiry_year' => 'required_with:card_details|integer|min:'.date('Y'),
                'card_details.cvv' => 'required_with:card_details|string|min:3|max:4',
                'card_details.holder_name' => 'required_with:card_details|string|max:255',
            ]);

            $customer = $this->getAuthenticatedCustomer();

            if (! $customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            $order = $customer->orders()->findOrFail($request->input('order_id'));

            // Check if order is already paid
            if ($order->is_paid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order is already paid',
                ], 400);
            }

            DB::beginTransaction();

            try {
                $paymentMethod = $request->input('payment_method');

                // Create payment record
                $payment = $order->payments()->create([
                    'amount' => $order->total,
                    'payment_method' => $paymentMethod,
                    'status' => Payment::STATUS_PENDING,
                ]);

                if ($paymentMethod === 'card') {
                    // Process card payment
                    $result = $this->processCardPayment($payment, $request->input('card_details'));

                    if ($result['success']) {
                        $payment->markAsCompleted($result['transaction_id'], $result['gateway_response']);
                        $order->updateStatus(Order::STATUS_CONFIRMED);
                    } else {
                        $payment->markAsFailed($result['error'], $result['gateway_response']);
                        DB::rollBack();

                        return response()->json([
                            'success' => false,
                            'message' => 'Payment failed: '.$result['error'],
                        ], 400);
                    }
                } else {
                    // Cash on delivery - mark as pending manual processing
                    $payment->update([
                        'status' => Payment::STATUS_PENDING,
                        'transaction_id' => 'COD-'.$order->order_number,
                    ]);
                    $order->updateStatus(Order::STATUS_CONFIRMED);
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Payment processed successfully',
                    'payment' => [
                        'id' => $payment->id,
                        'status' => $payment->status,
                        'status_label' => $payment->status_label,
                        'amount' => $payment->amount,
                        'payment_method' => $payment->payment_method,
                        'transaction_id' => $payment->transaction_id,
                    ],
                    'order' => [
                        'id' => $order->id,
                        'status' => $order->status,
                        'status_label' => $order->status_label,
                    ],
                ]);
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
                'message' => 'Payment processing failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get payment status for an order
     */
    public function status(Request $request, $orderId)
    {
        try {
            $customer = $this->getAuthenticatedCustomer();

            if (! $customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            $order = $customer->orders()->with('payments')->findOrFail($orderId);

            return response()->json([
                'success' => true,
                'payment_status' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => $order->total,
                    'is_paid' => $order->is_paid,
                    'payment_status' => $order->payment_status,
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
                            'failure_reason' => $payment->failure_reason,
                        ];
                    }),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payment status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Refund a payment
     */
    public function refund(Request $request, $paymentId)
    {
        try {
            $request->validate([
                'amount' => 'nullable|numeric|min:0.01',
                'reason' => 'nullable|string|max:500',
            ]);

            $customer = $this->getAuthenticatedCustomer();

            if (! $customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            // Find payment through customer's orders
            $payment = Payment::whereHas('order', function ($query) use ($customer) {
                $query->where('customer_id', $customer->id);
            })->findOrFail($paymentId);

            if (! $payment->is_successful) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot refund unsuccessful payment',
                ], 400);
            }

            if ($payment->is_refunded) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment is already refunded',
                ], 400);
            }

            $refundAmount = $request->input('amount', $payment->amount);
            $reason = $request->input('reason', 'Customer requested refund');

            DB::beginTransaction();

            try {
                // Process refund based on payment method
                if ($payment->payment_method === 'card') {
                    // For card payments, create a refund record
                    // In a real implementation, you would integrate with payment gateway
                    $refund = $payment->processRefund($refundAmount, $reason);
                } else {
                    // For cash on delivery, just mark as refunded
                    $payment->markAsRefunded($reason);
                }

                // Update order status if fully refunded
                if ($refundAmount >= $payment->amount) {
                    $payment->order->updateStatus(Order::STATUS_REFUNDED);
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Refund processed successfully',
                    'refund' => [
                        'amount' => $refundAmount,
                        'reason' => $reason,
                        'processed_at' => now(),
                    ],
                ]);
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
                'message' => 'Refund processing failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Process card payment (mock implementation)
     * In a real application, this would integrate with a payment gateway
     */
    private function processCardPayment($payment, $cardDetails)
    {
        // Mock payment processing
        // In production, integrate with Stripe, PayPal, or other payment gateways

        // Simulate processing delay
        usleep(500000); // 0.5 seconds

        // Mock validation
        $cardNumber = preg_replace('/\s+/', '', $cardDetails['number']);

        // Simple validation (in production, use proper card validation)
        if (strlen($cardNumber) < 13 || strlen($cardNumber) > 19) {
            return [
                'success' => false,
                'error' => 'Invalid card number',
                'gateway_response' => ['error' => 'Invalid card number'],
            ];
        }

        // Mock success/failure (90% success rate)
        $success = rand(1, 10) <= 9;

        if ($success) {
            return [
                'success' => true,
                'transaction_id' => 'TXN-'.strtoupper(uniqid()),
                'gateway_response' => [
                    'status' => 'approved',
                    'authorization_code' => strtoupper(uniqid()),
                    'last_four' => substr($cardNumber, -4),
                ],
            ];
        } else {
            return [
                'success' => false,
                'error' => 'Payment declined by bank',
                'gateway_response' => [
                    'status' => 'declined',
                    'decline_code' => 'insufficient_funds',
                ],
            ];
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
