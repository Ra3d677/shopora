import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Middleware ────────────────────────────────────────────────
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Set x-pathname header (original proxy logic)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // 2. Security Headers (only for HTML pages, not for API/static)
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

    return response;
  }

  // 3. For non-page requests, just set the header and return
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
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
};
