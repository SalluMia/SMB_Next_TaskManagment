// src/middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect the dashboard route
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token'); // Assuming you store the token in cookies

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Verify the token (you can adjust the secret key as needed)
      jwt.verify(token, process.env.JWT_SECRET as string);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths to apply the middleware
export const config = {
  matcher: ['/dashboard/:path*'], // Adjust as needed for other protected routes
};
