import { NextResponse } from 'next/server';

async function verifyToken(token) {
    if (!token) {
        return { isValid: false, error: 'No token provided' };
    }
    
    return { isValid: true };
}

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    const publicRoutes = [
        '/api/public',
        '/api/auth',
        '/api/accounts/forgot-password',
    ];

    if (publicRoutes.includes(path) || publicRoutes.some(route => path.startsWith(route))) {
        return NextResponse.next();
    }

    if (path.startsWith('/api')) {
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS, PATCH, DELETE, POST, PUT',
                    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
                },
            });
        }

        const authorizationHeader = request.headers.get('Authorization');
        const token = authorizationHeader?.split(' ')[1];

        const verificationResult = await verifyToken(token);

        if (!verificationResult.isValid) {
            return NextResponse.json(
                { message: "Authentication required", error: verificationResult.error },
                { status: 401 }
            );
        }

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