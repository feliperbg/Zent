import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Use secure cookie name in production usually, but sticking to next-auth common default
    // Adjust based on your next-auth configuration
    const sessionToken = request.cookies.get('authjs.session-token') ||
        request.cookies.get('__Secure-authjs.session-token') ||
        request.cookies.get('next-auth.session-token');

    const { pathname } = request.nextUrl;

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
    const isPublicApi = pathname.startsWith('/api/auth');
    const isStatic = pathname.match(/\.(.*)$/); // Avoid protecting static assets

    if (isStatic || isPublicApi) {
        return NextResponse.next();
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage) {
        if (sessionToken) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Redirect unauthenticated users to login
    if (!sessionToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
