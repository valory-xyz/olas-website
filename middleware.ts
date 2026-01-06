import { NextResponse } from 'next/server';

// OFAC comprehensively sanctioned countries and specific regions
// Cuba, Iran, North Korea, Syria, Russia (comprehensive sanctions)
// Belarus (sectoral sanctions - often included in web3 compliance)
const BLOCKED_COUNTRIES = ['CU', 'IR', 'KP', 'SY', 'RU', 'BY'];
// Ukrainian regions: Donetsk (14), Luhansk (09), Crimea (43/65), Sevastopol (23)
const BLOCKED_REGIONS = ['UA-14', 'UA-09', 'UA-43', 'UA-65', 'UA-23'];

export function middleware(request) {
  const country = request.headers.get('x-vercel-ip-country');
  const region = request.headers.get('x-vercel-ip-country-region');

  if (
    request.nextUrl.pathname === '/restricted' ||
    request.nextUrl.pathname === '/disclaimer'
  ) {
    return NextResponse.next();
  }

  if (
    (country && BLOCKED_COUNTRIES.includes(country)) ||
    (region && BLOCKED_REGIONS.includes(region))
  ) {
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
