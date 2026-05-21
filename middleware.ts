import { NextResponse } from 'next/server';

// OFAC comprehensively sanctioned countries and specific regions
// Cuba, Iran, North Korea, Syria, Russia (comprehensive sanctions)
// Belarus (sectoral sanctions - often included in web3 compliance)
const BLOCKED_COUNTRIES = ['CU', 'IR', 'KP', 'SY', 'RU', 'BY'];
// Ukrainian regions: Donetsk (14), Luhansk (09), Crimea (43/65), Sevastopol (23)
const BLOCKED_REGIONS = ['UA-14', 'UA-09', 'UA-43', 'UA-65', 'UA-23'];

// Content routes whose markdown source lives in the CMS (`body` field). When an
// agent sends `Accept: text/markdown`, rewrite to the markdown API route, which
// returns the native markdown instead of rendered HTML. The matched id is passed
// onward via a request header (see the rewrite below) because neither path
// segments nor query params survive a middleware rewrite into an API route.
const MARKDOWN_REWRITES: { pattern: RegExp; pathname: string }[] = [
  { pattern: /^\/blog\/([^/]+)\/?$/, pathname: '/api/md/blog' },
  {
    pattern: /^\/learn\/education-articles\/([^/]+)\/?$/,
    pathname: '/api/md/education-articles',
  },
];

const getMarkdownRewrite = (pathname: string): { pathname: string; id: string } | null => {
  for (const rewrite of MARKDOWN_REWRITES) {
    const match = pathname.match(rewrite.pattern);
    if (match) return { pathname: rewrite.pathname, id: match[1] };
  }
  return null;
};

export function middleware(request) {
  const country = request.headers.get('x-vercel-ip-country');
  const region = request.headers.get('x-vercel-ip-country-region');
  const { pathname } = request.nextUrl;

  if (pathname === '/restricted' || pathname === '/disclaimer') {
    return NextResponse.next();
  }

  if (
    (country && BLOCKED_COUNTRIES.includes(country)) ||
    (region && BLOCKED_REGIONS.includes(region))
  ) {
    return NextResponse.redirect(new URL('/restricted', request.url));
  }

  // Markdown for agents (RFC content negotiation): serve markdown variants of
  // CMS-backed content pages when explicitly requested. HTML stays the default.
  const accept = request.headers.get('accept') || '';
  if (accept.includes('text/markdown')) {
    const rewriteTarget = getMarkdownRewrite(pathname);
    if (rewriteTarget) {
      const url = request.nextUrl.clone();
      url.pathname = rewriteTarget.pathname;
      // After a rewrite the API handler sees the original req.url, so neither
      // the path segment nor a query param survives. Pass the id via a request
      // header instead.
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-olas-md-id', rewriteTarget.id);
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }
  }

  return NextResponse.next();
}

// Runs on all request paths aside from api and image-related files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
