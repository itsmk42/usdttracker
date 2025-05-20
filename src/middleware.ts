import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the user is authenticated
  const isAuthenticated = !!session;

  // Get the pathname from the request
  const { pathname } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/transactions'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Redirect logic
  if (!isAuthenticated && isProtectedRoute) {
    // Redirect to login page if trying to access protected route without authentication
    const redirectUrl = new URL('/auth', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && pathname === '/auth') {
    // Redirect to dashboard if already authenticated and trying to access auth page
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/transactions/:path*', '/auth'],
};
