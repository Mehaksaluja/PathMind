export interface User {
  id: string
  email: string
  name: string
}

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token')
    if (!token) return false
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiry = payload.exp * 1000
      return Date.now() < expiry
    } catch {
      return false
    }
  }
  return false
}

export function getCurrentUser(): User | null {
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

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth-token')
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

export async function verifyToken(): Promise<User | null> {
  const token = getAuthToken()
  if (!token) return null

  try {
    const response = await fetch('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      setUser(data.user)
      return data.user
    } else {
      clearAuth()
      return null
    }
  } catch {
    return null
  }
}

export const ROUTE_ACCESS = {
  PUBLIC: [
    '/',
    '/login',
    '/signup',
    '/how-it-works',
  ],
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

