const { withPlausibleProxy } = require('next-plausible');

module.exports = withPlausibleProxy()({
  reactStrictMode: true,
  images: {
    domains: [
      'cms-backend.staging.autonolas.tech',
      'cms-backend.autonolas.tech',
      'localhost',
    ],
  },
  experimental: {
    scrollRestoration: true,
  },
  async redirects() {
    return [
      {
        source: '/articles',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/dev-rewards',
        destination: '/build',
        permanent: true,
      },
      {
        source: '/bonds',
        destination: '/bond',
        permanent: true,
      },
      {
        source: '/brand-and-press-kit',
        destination:
          'https://github.com/contentwillvary/brand-and-press-kit-olas/blob/main/README.md',
        permanent: false,
      },
      {
        source: '/services/predict',
        destination: '/agent-economies/predict',
        permanent: true,
      },
      // old tokenomics app redirects
      {
        source: '/dev-incentives',
        destination: 'https://build.olas.network/dev-incentives',
        permanent: true,
      },
      {
        source: '/donate',
        destination: 'https://govern.olas.network/donate',
        permanent: true,
      },
      {
        source: '/bonding-products',
        destination: 'https://bond.olas.network/bonding-products',
        permanent: true,
      },
      {
        source: '/manage-solana-products',
        destination: 'https://bond.olas.network/manage-solana-liquidity',
        permanent: true,
      },
      {
        source: '/manage-solana-liquidity',
        destination: 'https://bond.olas.network/manage-solana-liquidity',
        permanent: true,
      },
      {
        source: '/my-bonds',
        destination: 'https://bond.olas.network/my-bonds',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' https://fonts.googleapis.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; block-all-mixed-content; upgrade-insecure-requests; connect-src 'self' https://plausible.io;",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Permissions-Policy',
            value: 'usb=()',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|css|js|mov|mp4)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate',
          },
        ],
      },
    ];
  },
});
