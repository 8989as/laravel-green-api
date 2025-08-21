<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class UserProfileController extends Controller
{
    /**
     * Get user profile information
     */
    public function show(Request $request)
    {
        try {
            $user = Auth::guard('sanctum')->user();

            if (! $user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            $customer = $user->customer;

            return response()->json([
                'success' => true,
                'profile' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'email_verified_at' => $user->email_verified_at,
                        'created_at' => $user->created_at,
                    ],
                    'customer' => $customer ? [
                        'id' => $customer->id,
                        'name' => $customer->name,
                        'phone_number' => $customer->phone_number,
                        'phone_verified_at' => $customer->phone_verified_at,
                        'is_phone_verified' => $customer->isPhoneVerified(),
                        'order_count' => $customer->order_count,
                        'total_spent' => $customer->total_spent,
                        'formatted_total_spent' => $customer->formatted_total_spent,
                    ] : null,
                    'addresses' => $customer ? $customer->addresses->map(function ($address) {
                        return [
                            'id' => $address->id,
                            'name' => $address->name,
                            'phone' => $address->phone,
                            'address_line_1' => $address->address_line_1,
                            'address_line_2' => $address->address_line_2,
                            'city' => $address->city,
                            'state' => $address->state,
                            'postal_code' => $address->postal_code,
                            'country' => $address->country,
                            'is_default' => false, // TODO: Implement default address logic
                        ];
                    }) : [],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve profile',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update user profile information
     */
    public function update(Request $request)
    {
        try {
            $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,'.Auth::id(),
                'customer_name' => 'sometimes|string|max:255',
                'phone_number' => 'sometimes|string|max:20',
            ]);

            $user = Auth::guard('sanctum')->user();

            if (! $user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            // Update user information
            $userUpdates = [];
            if ($request->has('name')) {
                $userUpdates['name'] = $request->input('name');
            }
            if ($request->has('email')) {
                $userUpdates['email'] = $request->input('email');
                $userUpdates['email_verified_at'] = null; // Reset email verification
            }

            if (! empty($userUpdates)) {
                $user->update($userUpdates);
            }

            // Update customer information
            $customer = $user->customer;
            if ($customer) {
                $customerUpdates = [];
                if ($request->has('customer_name')) {
                    $customerUpdates['name'] = $request->input('customer_name');
                }
                if ($request->has('phone_number')) {
                    $customerUpdates['phone_number'] = $request->input('phone_number');
                    $customerUpdates['phone_verified_at'] = null; // Reset phone verification
                }

                if (! empty($customerUpdates)) {
                    $customer->update($customerUpdates);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'profile' => [
                    'user' => [
                        'id' => $user->fresh()->id,
                        'name' => $user->fresh()->name,
                        'email' => $user->fresh()->email,
                        'email_verified_at' => $user->fresh()->email_verified_at,
                    ],
                    'customer' => $customer ? [
                        'id' => $customer->fresh()->id,
                        'name' => $customer->fresh()->name,
                        'phone_number' => $customer->fresh()->phone_number,
                        'phone_verified_at' => $customer->fresh()->phone_verified_at,
                        'is_phone_verified' => $customer->fresh()->isPhoneVerified(),
                    ] : null,
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
                'message' => 'Failed to update profile',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Change user password
     */
    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                'current_password' => 'required|string',
                'new_password' => ['required', 'confirmed', Password::defaults()],
            ]);

            $user = Auth::guard('sanctum')->user();

            if (! $user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            // Verify current password
            if (! Hash::check($request->input('current_password'), $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect',
                ], 400);
            }

            // Update password
            $user->update([
                'password' => Hash::make($request->input('new_password')),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully',
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
                'message' => 'Failed to change password',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user addresses
     */
    public function addresses(Request $request)
    {
        try {
            $user = Auth::guard('sanctum')->user();

            if (! $user || ! $user->customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            $addresses = $user->customer->addresses;

            return response()->json([
                'success' => true,
                'addresses' => $addresses->map(function ($address) {
                    return [
                        'id' => $address->id,
                        'name' => $address->name,
                        'phone' => $address->phone,
                        'address_line_1' => $address->address_line_1,
                        'address_line_2' => $address->address_line_2,
                        'city' => $address->city,
                        'state' => $address->state,
                        'postal_code' => $address->postal_code,
                        'country' => $address->country,
                        'is_default' => false, // TODO: Implement default address logic
                        'created_at' => $address->created_at,
                    ];
                }),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve addresses',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add new address
     */
    public function addAddress(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'address_line_1' => 'required|string|max:255',
                'address_line_2' => 'nullable|string|max:255',
                'city' => 'required|string|max:100',
                'state' => 'required|string|max:100',
                'postal_code' => 'required|string|max:20',
                'country' => 'required|string|max:100',
            ]);

            $user = Auth::guard('sanctum')->user();

            if (! $user || ! $user->customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            $address = $user->customer->addresses()->create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Address added successfully',
                'address' => [
                    'id' => $address->id,
                    'name' => $address->name,
                    'phone' => $address->phone,
                    'address_line_1' => $address->address_line_1,
                    'address_line_2' => $address->address_line_2,
                    'city' => $address->city,
                    'state' => $address->state,
                    'postal_code' => $address->postal_code,
                    'country' => $address->country,
                    'is_default' => false,
                    'created_at' => $address->created_at,
                ],
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update address
     */
    public function updateAddress(Request $request, $addressId)
    {
        try {
            $request->validate([
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|string|max:20',
                'address_line_1' => 'sometimes|string|max:255',
                'address_line_2' => 'nullable|string|max:255',
                'city' => 'sometimes|string|max:100',
                'state' => 'sometimes|string|max:100',
                'postal_code' => 'sometimes|string|max:20',
                'country' => 'sometimes|string|max:100',
            ]);

            $user = Auth::guard('sanctum')->user();

            if (! $user || ! $user->customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            $address = $user->customer->addresses()->findOrFail($addressId);
            $address->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Address updated successfully',
                'address' => [
                    'id' => $address->id,
                    'name' => $address->name,
                    'phone' => $address->phone,
                    'address_line_1' => $address->address_line_1,
                    'address_line_2' => $address->address_line_2,
                    'city' => $address->city,
                    'state' => $address->state,
                    'postal_code' => $address->postal_code,
                    'country' => $address->country,
                    'is_default' => false,
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
                'message' => 'Failed to update address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete address
     */
    public function deleteAddress(Request $request, $addressId)
    {
        try {
            $user = Auth::guard('sanctum')->user();

            if (! $user || ! $user->customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            $address = $user->customer->addresses()->findOrFail($addressId);
            $address->delete();

            return response()->json([
                'success' => true,
                'message' => 'Address deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user favorites
     */
    public function favorites(Request $request)
    {
        try {
            $user = Auth::guard('sanctum')->user();

            if (! $user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            $favorites = $user->favorites()->with('media')->paginate(12);

            return response()->json([
                'success' => true,
                'favorites' => $favorites->items(),
                'pagination' => [
                    'current_page' => $favorites->currentPage(),
                    'last_page' => $favorites->lastPage(),
                    'per_page' => $favorites->perPage(),
                    'total' => $favorites->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve favorites',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete user account
     */
    public function deleteAccount(Request $request)
    {
        try {
            $request->validate([
                'password' => 'required|string',
                'confirmation' => 'required|in:DELETE',
            ]);

            $user = Auth::guard('sanctum')->user();

            if (! $user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            // Verify password
            if (! Hash::check($request->input('password'), $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Password is incorrect',
                ], 400);
            }

            // Check for pending orders
            if ($user->customer && $user->customer->orders()->whereIn('status', ['pending', 'confirmed', 'processing', 'shipped'])->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete account with pending orders',
                ], 400);
            }

            // Revoke all tokens
            $user->tokens()->delete();

            // Delete user (this will cascade to customer and related data)
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Account deleted successfully',
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
                'message' => 'Failed to delete account',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
