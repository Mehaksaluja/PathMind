import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup', '/how-it-works']

// Protected routes that require authentication
const protectedRoutes = ['/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api')
  
  // For now, we'll allow access to all routes
  // In the future, you can add authentication check here
  // Example:
  // const token = request.cookies.get('auth-token')
  // if (isProtectedRoute && !token) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }
  
  // If accessing a protected route without auth, redirect to login
  // This is a placeholder - implement actual auth check later
  if (isProtectedRoute) {
    // TODO: Check if user is authenticated
    // For now, we'll allow access but you should implement proper auth
    // const isAuthenticated = checkAuth(request)
    // if (!isAuthenticated) {
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

