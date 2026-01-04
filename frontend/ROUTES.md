# Route Structure & Access Control

## Public Routes (No Authentication Required)

These routes can be accessed by anyone without signing in:

- `/` - Landing page
- `/login` - Login page
- `/signup` - Sign up page
- `/how-it-works` - How It Works page

## Protected Routes (Authentication Required)

These routes require the user to be authenticated:

- `/dashboard` - Main dashboard with roadmap visualization

## Route Protection Implementation

### 1. Middleware (`middleware.ts`)
- Handles route protection at the server level
- Currently allows all routes (placeholder for future auth implementation)
- When auth is implemented, it will redirect unauthenticated users from protected routes to `/login`

### 2. ProtectedRoute Component (`components/ProtectedRoute.tsx`)
- Client-side route protection wrapper
- Checks authentication status before rendering protected content
- Redirects to `/login` if user is not authenticated
- Shows loading state while checking authentication

### 3. Auth Utilities (`lib/auth.ts`)
- Contains authentication helper functions
- Defines route access configuration
- Provides functions to check authentication status
- Currently uses localStorage (will be updated when backend auth is implemented)

## Usage

### Protecting a Route

Wrap your page component with `ProtectedRoute`:

```tsx
import ProtectedRoute from '@/components/ProtectedRoute'

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Protected Content</div>
    </ProtectedRoute>
  )
}
```

### Checking Authentication

```tsx
import { isAuthenticated, getCurrentUser } from '@/lib/auth'

if (isAuthenticated()) {
  const user = getCurrentUser()
  // User is logged in
}
```

## Future Implementation

When backend authentication is implemented:

1. Update `middleware.ts` to check JWT tokens from cookies
2. Update `lib/auth.ts` to use actual API calls for auth verification
3. Update `ProtectedRoute.tsx` to handle token refresh
4. Add proper session management

