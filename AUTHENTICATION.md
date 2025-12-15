# Authentication System Documentation

This document describes the complete authentication system implemented in the Redical_JVAI application.

## Overview

The authentication system is built using:
- **Redux Toolkit** for state management
- **RTK Query** for API calls
- **React Router** for routing and protected routes
- **localStorage** for token persistence

## Architecture

### 1. Redux Store Configuration

**Location:** `src/Redux/store.js`

The store includes:
- `auth` reducer for authentication state
- `authApi` middleware for API calls
- Token persistence via localStorage

### 2. Authentication Slice

**Location:** `src/Redux/features/auth/authSlice.js`

**State Structure:**
```javascript
{
  user: null | { name, email, avatar, ... },
  token: null | string,
  isAuthenticated: boolean
}
```

**Actions:**
- `setCredentials(user, token)` - Store user data and token
- `logout()` - Clear authentication state
- `updateUser(userData)` - Update user information

**Selectors:**
- `selectCurrentUser` - Get current user data
- `selectCurrentToken` - Get authentication token
- `selectIsAuthenticated` - Check if user is authenticated

### 3. Authentication API Service

**Location:** `src/Redux/services/authApi.js`

**Available Endpoints:**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | User login |
| `/auth/signup` | POST | User registration |
| `/auth/logout` | POST | User logout |
| `/auth/forgot-password` | POST | Request password reset |
| `/auth/verify-otp` | POST | Verify OTP code |
| `/auth/reset-password` | POST | Reset password |
| `/auth/me` | GET | Get current user data |
| `/auth/refresh-token` | POST | Refresh authentication token |

**React Hooks:**
- `useLoginMutation()`
- `useSignupMutation()`
- `useLogoutMutation()`
- `useForgotPasswordMutation()`
- `useVerifyOtpMutation()`
- `useResetPasswordMutation()`
- `useGetCurrentUserQuery()`
- `useRefreshTokenMutation()`

### 4. Protected Routes

**Location:** `src/components/ProtectedRoute.jsx`

Wraps routes that require authentication. Redirects to `/auth/login` if user is not authenticated.

**Usage in Routes:**
```javascript
<ProtectedRoute>
  <AdminLayout />
</ProtectedRoute>
```

### 5. Login Component

**Location:** `src/Admin/Auth/Login.jsx`

**Features:**
- Email and password input fields
- Password visibility toggle
- Loading states during authentication
- Error handling and display
- Automatic redirect after successful login
- Links to forgot password and sign up

**Login Flow:**
1. User enters credentials
2. Form submission triggers `login` mutation
3. On success, credentials are stored in Redux and localStorage
4. User is redirected to `/admin`
5. On error, error message is displayed

### 6. Header with Logout

**Location:** `src/layouts/Header.jsx`

**Features:**
- User avatar dropdown menu
- Display user name and email
- Profile navigation
- Logout functionality
- User initials fallback for avatar

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory (use `.env.example` as template):

```env
VITE_API_URL=https://your-api-url.com
```

### 2. API Integration

Update the API base URL in `src/Redux/services/authApi.js` or set the `VITE_API_URL` environment variable.

### 3. Expected API Response Format

The API should return responses in the following format:

**Login Response:**
```json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  },
  "token": "jwt-token-string"
}
```

**Error Response:**
```json
{
  "message": "Invalid credentials"
}
```

## Token Management

### Storage
- Tokens are stored in both Redux state and localStorage
- localStorage ensures persistence across page refreshes

### Auto-loading
- On app initialization, token and user data are loaded from localStorage
- If token exists, user is considered authenticated

### Token Expiry
- Implement token refresh logic using `useRefreshTokenMutation()`
- Add token expiry handling in API interceptors if needed

## Usage Examples

### Using Authentication in Components

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, logout } from '@/Redux/features/auth/authSlice';

function MyComponent() {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Making Authenticated API Calls

```javascript
import { useGetCurrentUserQuery } from '@/Redux/services/authApi';

function ProfileComponent() {
  const { data: user, isLoading, error } = useGetCurrentUserQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return <div>Profile: {user.name}</div>;
}
```

### Creating New Protected Routes

```javascript
import ProtectedRoute from '@/components/ProtectedRoute';

{
  path: "/admin/new-page",
  element: (
    <ProtectedRoute>
      <NewPageComponent />
    </ProtectedRoute>
  )
}
```

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage. For enhanced security, consider using httpOnly cookies
2. **HTTPS**: Always use HTTPS in production
3. **Token Expiry**: Implement token refresh mechanism
4. **XSS Protection**: Sanitize all user inputs
5. **CSRF Protection**: Implement CSRF tokens if using cookies

## Testing the Login System

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173/auth/login`

3. Test scenarios:
   - Valid credentials → Should redirect to `/admin`
   - Invalid credentials → Should show error message
   - Logout → Should redirect to login page
   - Protected routes without login → Should redirect to login
   - Page refresh → Should maintain authentication state

## Troubleshooting

### Issue: User not redirected after login
- Check Redux state is updated with user and token
- Verify `isAuthenticated` selector returns true
- Check browser console for navigation errors

### Issue: Protected routes not working
- Verify `ProtectedRoute` component is properly wrapped around routes
- Check Redux state for authentication status
- Clear localStorage and try again

### Issue: API calls failing
- Verify `VITE_API_URL` is set correctly
- Check network tab for API endpoint URLs
- Verify token is being sent in request headers

## Future Enhancements

- [ ] Implement token refresh mechanism
- [ ] Add "Remember Me" functionality
- [ ] Implement social login (Google, Facebook, etc.)
- [ ] Add two-factor authentication
- [ ] Implement password strength meter
- [ ] Add session timeout warnings
- [ ] Implement device management
- [ ] Add login activity tracking

## Support

For issues or questions, please contact the development team or create an issue in the project repository.
