import { NextResponse } from 'next/server';

// List of allowed origins
const allowedOrigins = [
    'https://movie-theater-be-api.vercel.app',
    'http://localhost:3000'
];

async function verifyToken(token) {
    if (!token) {
        return { isValid: false, error: 'No token provided' };
    }
    return { isValid: true };
}

export async function middleware(request) {
    const path = request.nextUrl.pathname;
    const requestOrigin = request.headers.get('origin');

    // Handle preflight OPTIONS requests immediately.
    if (request.method === 'OPTIONS') {
        const responseHeaders = new Headers();
        responseHeaders.set('Access-Control-Allow-Credentials', 'true');
        
        // Set the allowed origin dynamically
        if (allowedOrigins.includes(requestOrigin)) {
        responseHeaders.set('Access-Control-Allow-Origin', requestOrigin);
        }

        responseHeaders.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        responseHeaders.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

        return new NextResponse(null, { status: 200, headers: responseHeaders });
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
        console.log([...request.headers.entries()]);
        console.log(request.headers.get('Authorization'));

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
