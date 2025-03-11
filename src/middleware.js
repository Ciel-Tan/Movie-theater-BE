import { NextResponse } from 'next/server';

async function verifyToken(token) {
    if (!token) {
        return { isValid: false, error: 'No token provided' };
    }
    // Your token verification logic can go here.
    return { isValid: true };
}

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    // Handle preflight (OPTIONS) requests immediately.
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': request.headers.get('origin') || '',
            'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
            'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
        }
        });
    }

    const publicRoutes = [
        '/api/public',
        '/api/auth',
        '/api/accounts/forgot-password',
    ];

    if (publicRoutes.includes(path) || publicRoutes.some(route => path.startsWith(route))) {
        return NextResponse.next();
    }

    if (path.startsWith('/api')) {
        // Debug logging for headers (you can remove these once resolved)
        console.log([...request.headers.entries()]);
        console.log(request.headers.get('Authorization'));
        console.log(request.headers.get('authorization'));

        const authorizationHeader = request.headers.get('Authorization');
        const token = authorizationHeader?.split(' ')[1];

        const verificationResult = await verifyToken(token);

        if (!verificationResult.isValid) {
        return NextResponse.json(
            { message: "Authentication required", error: verificationResult.error },
            { status: 401 }
        );
        }

        // Pass the original Authorization header to the API via a custom header.
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-auth-token', authorizationHeader);

        return NextResponse.next({
        request: { headers: requestHeaders },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
    runtime: 'nodejs'
};
