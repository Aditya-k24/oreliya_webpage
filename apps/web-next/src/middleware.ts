import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Security headers
  const response = NextResponse.next();

  // Enhanced CSP headers for production
  const isProduction = process.env.NODE_ENV === 'production';
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
  
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      `connect-src 'self' ${apiBaseUrl}`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      isProduction ? "upgrade-insecure-requests" : "",
    ].filter(Boolean).join('; ')
  );

  // Enhanced security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );

  // Rate limiting headers (basic)
  response.headers.set('X-RateLimit-Limit', '100');
  response.headers.set('X-RateLimit-Remaining', '99');

  return response;
}

export default withAuth(
  function authMiddleware(req) {
    const { pathname } = req.nextUrl;
    
    // Allow public access to these routes
    const publicRoutes = [
      '/',
      '/products',
      '/products/[id]',
      '/about',
      '/customization',
      '/contact',
      '/login',
      '/register',
      '/api/auth',
      '/uploads'
    ];
    
    // Check if the current path matches any public route pattern
    const isPublicRoute = publicRoutes.some(route => {
      if (route.includes('[id]')) {
        // Handle dynamic routes like /products/[id]
        const pattern = route.replace('[id]', '[^/]+');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(pathname) || pathname.startsWith('/products/');
      }
      return pathname === route || pathname.startsWith(route);
    });
    
    // Allow public routes
    if (isPublicRoute) {
      return NextResponse.next();
    }
    
    // Protect admin routes
    if (pathname.startsWith('/admin')) {
      const token = req.nextauth.token;
      // Check if token has admin role - try different possible structures
      const userRole = (token as any)?.user?.role || (token as any)?.role;
      if (!token || userRole !== 'admin') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public routes without authentication
        const publicRoutes = [
          '/',
          '/products',
          '/products/[id]',
          '/about',
          '/customization',
          '/contact',
          '/login',
          '/register',
          '/api/auth',
          '/uploads'
        ];
        
        const isPublicRoute = publicRoutes.some(route => {
          if (route.includes('[id]')) {
            return pathname.startsWith('/products/');
          }
          return pathname === route || pathname.startsWith(route);
        });
        
        if (isPublicRoute) {
          return true;
        }
        
        // Require authentication for other routes
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

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
};
