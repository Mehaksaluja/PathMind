/**
 * Authentication utility functions
 * This file will handle authentication state and checks
 */

// For now, this is a placeholder
// In the future, implement actual authentication logic here

export interface User {
  id: string
  email: string
  name: string
}

export function isAuthenticated(): boolean {
  // TODO: Check if user is authenticated
  // This should check cookies, localStorage, or session
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token')
    return !!token
  }
  return false
}

export function getCurrentUser(): User | null {
  // TODO: Get current user from token/session
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
  }
  return null
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth-token', token)
  }
}

export function setUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user')
  }
}

// Route access configuration
export const ROUTE_ACCESS = {
  // Public routes - accessible without authentication
  PUBLIC: [
    '/',
    '/login',
    '/signup',
    '/how-it-works',
  ],
  // Protected routes - require authentication
  PROTECTED: [
    '/dashboard',
  ],
} as const

export function isPublicRoute(pathname: string): boolean {
  return ROUTE_ACCESS.PUBLIC.includes(pathname)
}

export function isProtectedRoute(pathname: string): boolean {
  return ROUTE_ACCESS.PROTECTED.some(route => pathname.startsWith(route))
}

