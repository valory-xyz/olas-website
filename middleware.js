import { NextResponse } from 'next/server';

const BLOCKED_REGIONS = ['UA-14', 'UA-09', 'UA-65', 'UA-23', 'GB-LND']; //GB-LDN added for testing TODO: remove after testing

export function middleware(request) {
  const region = request.headers.get('x-vercel-ip-country-region');

  if (
    request.nextUrl.pathname === '/restricted' ||
    request.nextUrl.pathname === '/disclaimer'
  ) {
    return NextResponse.next();
  }

  if (region && BLOCKED_REGIONS.includes(region)) {
    return NextResponse.redirect(new URL('/restricted', request.url));
  }

  return NextResponse.next();
}

// Runs on all request paths aside from api and image-related files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
