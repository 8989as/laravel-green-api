<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class CartController extends Controller
{
    /**
     * Get cart contents
     */
    public function index(Request $request)
    {
        try {
            $cart = $this->getOrCreateCart($request);

            return response()->json([
                'success' => true,
                'cart' => [
                    'id' => $cart->id,
                    'items' => $cart->items->map(function ($item) {
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
                            'unit_price' => $item->unit_price,
                            'total_price' => $item->total_price,
                            'product_options' => $item->product_options,
                        ];
                    }),
                    'subtotal' => $cart->subtotal,
                    'tax' => $cart->tax,
                    'shipping' => $cart->shipping,
                    'discount' => $cart->discount,
                    'total' => $cart->total,
                    'item_count' => $cart->item_count,
                    'is_empty' => $cart->is_empty,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve cart',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add item to cart
     */
    public function add(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'integer|min:1|max:100',
                'product_options' => 'nullable|array',
            ]);

            $cart = $this->getOrCreateCart($request);
            $productId = $request->input('product_id');
            $quantity = $request->input('quantity', 1);
            $productOptions = $request->input('product_options');

            $item = $cart->addItem($productId, $quantity, $productOptions);

            return response()->json([
                'success' => true,
                'message' => 'Product added to cart',
                'item' => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->total_price,
                ],
                'cart_summary' => [
                    'item_count' => $cart->fresh()->item_count,
                    'total' => $cart->fresh()->total,
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add item to cart',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request)
    {
        try {
            $request->validate([
                'item_id' => 'required|exists:cart_items,id',
                'quantity' => 'required|integer|min:0|max:100',
            ]);

            $cart = $this->getOrCreateCart($request);
            $itemId = $request->input('item_id');
            $quantity = $request->input('quantity');

            if ($quantity == 0) {
                $cart->removeItem($itemId);
                $message = 'Item removed from cart';
            } else {
                $item = $cart->updateItemQuantity($itemId, $quantity);
                $message = 'Cart updated';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'cart_summary' => [
                    'item_count' => $cart->fresh()->item_count,
                    'total' => $cart->fresh()->total,
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update cart',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove item from cart
     */
    public function remove(Request $request)
    {
        try {
            $request->validate([
                'item_id' => 'required|exists:cart_items,id',
            ]);

            $cart = $this->getOrCreateCart($request);
            $itemId = $request->input('item_id');

            $cart->removeItem($itemId);

            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart',
                'cart_summary' => [
                    'item_count' => $cart->fresh()->item_count,
                    'total' => $cart->fresh()->total,
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove item from cart',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Clear entire cart
     */
    public function clear(Request $request)
    {
        try {
            $cart = $this->getOrCreateCart($request);
            $cart->clear();

            return response()->json([
                'success' => true,
                'message' => 'Cart cleared',
                'cart_summary' => [
                    'item_count' => 0,
                    'total' => 0,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear cart',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Apply discount to cart
     */
    public function applyDiscount(Request $request)
    {
        try {
            $request->validate([
                'discount_code' => 'required|string',
            ]);

            $cart = $this->getOrCreateCart($request);
            $discountCode = $request->input('discount_code');

            // TODO: Implement discount code validation and application
            // For now, return a placeholder response

            return response()->json([
                'success' => false,
                'message' => 'Discount functionality not yet implemented',
            ], 501);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Get or create cart for current session/user
     */
    private function getOrCreateCart(Request $request)
    {
        // Try to get authenticated customer first
        if (Auth::guard('sanctum')->check()) {
            $user = Auth::guard('sanctum')->user();
            if ($user->customer) {
                return $user->customer->getOrCreateCart();
            }
        }

        // Fall back to session-based cart
        $sessionId = $request->session()->getId();

        $cart = Cart::forSession($sessionId)->active()->first();

        if (! $cart) {
            $cart = Cart::create([
                'session_id' => $sessionId,
                'expires_at' => now()->addDays(30),
            ]);
        }

        return $cart;
    }
}
