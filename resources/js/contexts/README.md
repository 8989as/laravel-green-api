# React Context State Management

This directory contains the enhanced React contexts for managing application state across the e-commerce platform.

## Context Architecture

### 1. UserContext (Primary)
**File**: `UserContext.jsx`
**Purpose**: Unified authentication and profile management

**Features**:
- Authentication (login, register, logout)
- Profile management
- Address management
- Phone number normalization
- Error handling
- Token management

**Usage**:
```jsx
import { useUser } from './contexts/UserContext.jsx';

const { 
  user, 
  isAuthenticated, 
  login, 
  register, 
  updateProfile,
  addresses,
  addAddress 
} = useUser();
```

### 2. CartContext (Enhanced)
**File**: `CartContext.jsx`
**Purpose**: Shopping cart state management

**Features**:
- Cart items management (add, update, remove, clear)
- Cart calculations (subtotal, tax, shipping, total)
- Cart UI state (open/close sidebar)
- Persistent cart across sessions
- Cart validation

**Usage**:
```jsx
import { useCart } from './contexts/CartContext.jsx';

const { 
  cartItems, 
  cartCount, 
  cartTotal,
  addToCart, 
  removeFromCart,
  getCartSummary,
  toggleCart 
} = useCart();
```

### 3. OrderContext (Enhanced)
**File**: `OrderContext.jsx`
**Purpose**: Order processing and management

**Features**:
- Order creation and management
- Checkout data management
- Order history and tracking
- Order statistics
- Order status management

**Usage**:
```jsx
import { useOrders } from './contexts/OrderContext.jsx';

const { 
  orders, 
  currentOrder,
  checkoutData,
  createOrder,
  updateCheckoutData,
  fetchOrders 
} = useOrders();
```

### 4. IntegratedContext
**File**: `ContextIntegration.jsx`
**Purpose**: Cross-context operations and unified state

**Features**:
- Complete checkout process
- Integrated cart and order operations
- Unified error handling
- Combined state access
- Cross-context actions

**Usage**:
```jsx
import { useIntegratedContext } from './contexts/ContextIntegration.jsx';

const { 
  completeCheckout,
  addToCartWithFeedback,
  reorderToCart,
  logoutAndClear 
} = useIntegratedContext();
```

## Context Provider Setup

The contexts are nested in the following order in `App.jsx`:

```jsx
<UserProvider>
  <AuthProvider>        {/* Legacy - for backward compatibility */}
    <AccountProvider>   {/* Legacy - for backward compatibility */}
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            <IntegratedContextProvider>
              {/* Your app components */}
            </IntegratedContextProvider>
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </AccountProvider>
  </AuthProvider>
</UserProvider>
```

## Key Enhancements

### 1. Cart State Management
- **Enhanced Calculations**: Automatic calculation of subtotal, tax, shipping, and total
- **UI State**: Cart sidebar open/close state management
- **Utility Functions**: `isInCart()`, `getCartItem()`, `getCartSummary()`
- **Better Error Handling**: Comprehensive error states and messages

### 2. Order Processing
- **Checkout Flow**: Complete checkout data management
- **Order Statistics**: Real-time order statistics tracking
- **Order Creation**: Streamlined order creation process
- **Status Management**: Order status tracking and updates

### 3. User Management
- **Unified Context**: Combined authentication and profile management
- **Address Management**: Complete address CRUD operations
- **Phone Normalization**: Automatic phone number formatting
- **Session Management**: Token-based authentication with automatic refresh

### 4. Context Integration
- **Cross-Context Operations**: Actions that work across multiple contexts
- **Unified State**: Combined state access for easier component development
- **Error Aggregation**: Centralized error handling across contexts
- **Loading States**: Unified loading state management

## Migration Guide

### From AuthContext to UserContext
```jsx
// Old way
import { useAuth } from './contexts/AuthContext.jsx';
const { user, login, logout } = useAuth();

// New way (recommended)
import { useUser } from './contexts/UserContext.jsx';
const { user, login, logout } = useUser();
```

### From AccountContext to UserContext
```jsx
// Old way
import { useAccount } from './contexts/AccountContext.jsx';
const { profile, addresses, updateProfile } = useAccount();

// New way (recommended)
import { useUser } from './contexts/UserContext.jsx';
const { profile, addresses, updateProfile } = useUser();
```

## Best Practices

1. **Use UserContext** for all authentication and profile operations
2. **Use IntegratedContext** for complex operations involving multiple contexts
3. **Keep legacy contexts** for backward compatibility during migration
4. **Handle loading states** appropriately in components
5. **Use error boundaries** to catch context-related errors
6. **Validate authentication** before performing protected operations

## Testing

Context integration tests are available in `tests/contexts/ContextIntegration.test.jsx`.

To test contexts:
1. Mock axios for API calls
2. Wrap components with appropriate providers
3. Test state changes and actions
4. Verify error handling

## Configuration

Context configuration is available in `contexts/index.js`:

```jsx
import { ContextConfig } from './contexts/index.js';

// Access configuration
const taxRate = ContextConfig.cart.taxRate; // 0.15 (15%)
const freeShippingThreshold = ContextConfig.cart.freeShippingThreshold; // 100
```

## Requirements Compliance

This implementation satisfies the following requirements:

- **3.1**: CartContext maintains cart state consistently ✅
- **3.2**: OrderContext manages order state throughout the flow ✅
- **3.3**: UserContext provides authentication and profile information ✅
- **3.4**: Multiple contexts integrate seamlessly without conflicts ✅