import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect the dashboard route
  if (pathname.startsWith('/dashboard')) {
    const tokenCookie = request.cookies.get('token'); // Get the cookie object

    // Check if the token exists and extract its value
    const token = tokenCookie ? tokenCookie.value : null; // Extract the value from the RequestCookie

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
