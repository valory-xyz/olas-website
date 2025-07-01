const {
  BUILD_URL,
  GOVERN_URL,
  BONDING_PROGRAMS_URL,
  BOND_URL,
} = require('common-util/constants');
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
        source: '/agent-economies/optimus',
        destination: '/agent-economies/babydegen',
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
        source: '/services/:path*',
        destination: '/agents/:path*',
        permanent: true,
      },
      // previously /services but renamed /agents
      {
        source: '/dev-incentives',
        destination: `${BUILD_URL}/dev-incentives`,
        permanent: true,
      },
      {
        source: '/donate',
        destination: `${GOVERN_URL}/donate`,
        permanent: true,
      },
      {
        source: '/bonding-products',
        destination: BONDING_PROGRAMS_URL,
        permanent: true,
      },
      {
        source: '/manage-solana-products',
        destination: `${BOND_URL}/manage-solana-liquidity`,
        permanent: true,
      },
      {
        source: '/manage-solana-liquidity',
        destination: `${BOND_URL}/manage-solana-liquidity`,
        permanent: true,
      },
      {
        source: '/my-bonds',
        destination: `${BOND_URL}/my-bonds`,
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
            value: "frame-ancestors 'none';",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
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
