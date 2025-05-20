import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  // Create a response object that we'll modify and return
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // This is used for setting cookies during redirects
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          // This is used for removing cookies during redirects
          res.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  // Get the user's session
  const { data: { session } } = await supabase.auth.getSession();

  // Check if the user is authenticated
  const isAuthenticated = !!session;

  // Get the pathname from the request
  const { pathname } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/transactions'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // For debugging - add a custom header to see authentication status
  res.headers.set('x-is-authenticated', isAuthenticated ? 'true' : 'false');

  // Redirect logic
  if (!isAuthenticated && isProtectedRoute) {
    console.log('Middleware: Not authenticated, redirecting to /auth');
    // Redirect to login page if trying to access protected route without authentication
    const redirectUrl = new URL('/auth', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && pathname === '/auth') {
    console.log('Middleware: Already authenticated, redirecting to /dashboard');
    // Redirect to dashboard if already authenticated and trying to access auth page
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Return the response with the session
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/transactions/:path*', '/auth'],
};
