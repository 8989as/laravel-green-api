# WhatsApp OTP Authentication System Guide

## Overview

This authentication system uses WhatsApp OTP (One-Time Password) for user registration and login. The system stores JWT tokens in localStorage for session management and provides route protection for authenticated-only features.

## API Endpoints

### 1. Send OTP
- **Endpoint**: `POST /api/send-otp`
- **Purpose**: Send OTP to any phone number
- **Payload**: `{ phone_number: "201555545417" }`
- **Response**: `{ message: "OTP sent to WhatsApp" }`

### 2. Register
- **Endpoint**: `POST /api/register`
- **Purpose**: Register new user with OTP verification
- **Payload**: `{ name: "John Doe", phone_number: "201555545417", otp: "123456" }`
- **Response**: `{ message: "Registration successful", token: "jwt_token", customer: {...} }`

### 3. Login
- **Endpoint**: `POST /api/login`
- **Purpose**: Login existing user with OTP verification
- **Payload**: `{ phone_number: "201555545417", otp: "123456" }`
- **Response**: `{ message: "Login successful", token: "jwt_token", customer: {...} }`

## React Components

### AuthContext
The main authentication context that manages:
- User state and authentication status
- Token management (localStorage)
- API calls for OTP and authentication
- Error handling

### AuthModal
Modal component that handles both login and registration flows:
- Two-step process: phone number → OTP verification
- Prevents closing during OTP step
- Automatic redirect after successful authentication

### ProtectedRoute
Component for protecting entire routes:
```jsx
<ProtectedRoute>
  <ProfilePage />
</ProtectedRoute>
```

### useRequireAuth Hook
Hook for protecting specific actions within components:
```jsx
const { requireAuth, showAuthModal, closeAuthModal } = useRequireAuth();

const handleAddToCart = () => {
  requireAuth(() => {
    // Add to cart logic here
  }, 'login');
};
```

## Usage Examples

### 1. Protecting Routes
```jsx
import ProtectedRoute from './components/ProtectedRoute';

// In your router
<Route path="/profile" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
```

### 2. Protecting Actions (Cart, Favorites, etc.)
```jsx
import { useRequireAuth } from './hooks/useRequireAuth';
import AuthModal from './components/Auth/AuthModal';

const ProductCard = ({ product }) => {
  const { requireAuth, showAuthModal, closeAuthModal } = useRequireAuth();

  const handleAddToCart = () => {
    requireAuth(async () => {
      // This will only execute if user is authenticated
      await addToCartAPI(product.id);
    });
  };

  const handleToggleFavorite = () => {
    requireAuth(async () => {
      await toggleFavoriteAPI(product.id);
    });
  };

  return (
    <div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={handleToggleFavorite}>♥</button>
      
      <AuthModal
        show={showAuthModal}
        onHide={closeAuthModal}
        initialTab="login"
      />
    </div>
  );
};
```

### 3. Using AuthContext Directly
```jsx
import { useAuth } from './contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          Welcome, {user.name}
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <AuthButton />
      )}
    </div>
  );
};
```

## Protected Features

The following features should require authentication:
- ✅ Add to Cart
- ✅ Checkout Process
- ✅ User Profile
- ✅ Favorites List
- ✅ Order History
- ✅ Event Registration
- ✅ Landscape Booking

## Token Management

- Tokens are stored in `localStorage` as `auth_token`
- Axios is configured to automatically include the token in requests
- Token is removed on logout
- Invalid tokens should trigger automatic logout (implement in API error handling)

## Error Handling

The system handles various error scenarios:
- Invalid OTP
- Expired OTP
- Network errors
- Server errors
- Invalid tokens

## Security Considerations

1. **Token Storage**: Using localStorage (consider httpOnly cookies for production)
2. **OTP Expiry**: OTPs expire after 5 minutes
3. **Rate Limiting**: Should be implemented on the backend
4. **Phone Number Validation**: Implement proper phone number format validation
5. **HTTPS**: Ensure all communication is over HTTPS in production

## Translation Keys

Add these translation keys to your i18n files:
```json
{
  "sendOTP": "Send OTP",
  "verificationCode": "Verification Code",
  "otpSentTo": "OTP sent to",
  "back": "Back",
  "login": "Login",
  "register": "Register",
  "phoneNumber": "Phone Number",
  "enterYourPhone": "Enter your phone number",
  "firstName": "First Name",
  "lastName": "Last Name",
  "enterYourFirstName": "Enter your first name",
  "enterYourLastName": "Enter your last name"
}
```

## Migration from Old System

1. Update all components using the old auth system
2. Replace old authentication checks with `useAuth` hook
3. Update protected routes to use `ProtectedRoute` component
4. Replace old auth modals with the new `AuthModal`
5. Update API calls to include Bearer token authentication