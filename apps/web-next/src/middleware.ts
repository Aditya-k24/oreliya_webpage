import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimit(request: NextRequest, limit: number = 100, windowMs: number = 15 * 60 * 1000) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  // const windowStart = now - windowMs;
  
  // Clean up old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
  
  const current = rateLimitStore.get(ip);
  
  if (!current || current.resetTime < now) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  
  if (current.count >= limit) {
    return { success: false, remaining: 0 };
  }
  
  current.count++;
  return { success: true, remaining: limit - current.count };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api');

  // Only rate-limit API routes; never rate-limit page navigations
  let rateLimitResult: { success: boolean; remaining: number } = { success: true, remaining: 100 };
  if (isApi) {
    rateLimitResult = rateLimit(request, 100, 15 * 60 * 1000); // 100 requests per 15 minutes
    if (!rateLimitResult.success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '900', // 15 minutes
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
        }
      });
    }
  }

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

  // Rate limiting headers (only for API routes)
  if (isApi) {
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  }

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
