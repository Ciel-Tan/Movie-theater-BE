import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

async function verifyToken(token, secret) {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload;
}

async function authenticateToken(token) {
    if (!token) {
        return { isValid: false, error: 'No token provided' };
    }
    
    try {
        const decoded = await verifyToken(token, process.env.JWT_SECRET);
        return { isValid: true, account_id: decoded.account_id, role_name: decoded.role_name };
    }
    catch (error) {
        console.error('Token Error:', error);
        return { isValid: false, error: 'Invalid token' };
    }
}

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    const allowedUserPermissionsRoutes = [
        {route: '/api/accounts/', methods: ['GET', 'PUT']},
        {route: '/api/accounts/change-password', methods: ['POST']},
        {route: '/api/bookings/create', methods: ['POST']}
    ];

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

        const verificationResult = await authenticateToken(token);

        if (!verificationResult.isValid) {
            return NextResponse.json(
                { message: "Authentication required", error: verificationResult.error },
                { status: 401 }
            );
        }

        if (verificationResult.role_name === 'user'){
            const allowedRoute = allowedUserPermissionsRoutes.find(
                route => path.startsWith(route.route) &&
                route.methods.includes(request.method)
            );
            
            if (path === '/api/accounts/getAll' || !allowedRoute) {
                return NextResponse.json(
                    { message: "Unauthorized", error: "Insufficient permissions" },
                    { status: 403 }
                )
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*'
};