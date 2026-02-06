const { withPlausibleProxy } = require('next-plausible');

module.exports = withPlausibleProxy()({
  reactStrictMode: true,
  images: {
    domains: ['cms-backend.staging.autonolas.tech', 'cms-backend.autonolas.tech', 'localhost'],
  },
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: ['lodash'],
  },
  async redirects() {
    return [
      {
        source: '/articles',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/education-articles',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/poaa-whitepaper.pdf',
        destination: '/whitepaper',
        permanent: true,
      },
      {
        source: '/explore',
        destination: '/agents',
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
        source: '/bottle',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ea-agentsfun',
        destination: 'https://www.pearl.you/',
        permanent: true,
      },
      {
        source: '/ea-all',
        destination: 'https://www.pearl.you/',
        permanent: true,
      },
      {
        source: '/ea-modius',
        destination: 'https://www.pearl.you/',
        permanent: true,
      },
      {
        source: '/pearl',
        destination: 'https://www.pearl.you/',
        permanent: true,
      },
      {
        source: '/agents/predict',
        destination: '/agents/omenstrat',
        permanent: false,
      },
      {
        source: '/agents/prediction-agents',
        destination: '/agents/omenstrat',
        permanent: false,
      },
      {
        source: '/agents/optimus',
        destination: '/agents/babydegen',
        permanent: true,
      },
      {
        source: '/agents/optimus-agent',
        destination: '/agents/babydegen',
        permanent: true,
      },
      {
        source: '/agents/modius-agent',
        destination: '/agents/babydegen',
        permanent: true,
      },
      {
        source: '/agents/mech',
        destination: '/agents/ai-mechs',
        permanent: true,
      },
      {
        source: '/academy',
        destination: '/404',
        permanent: false,
      },
      {
        source: '/protocol',
        destination: '/stack',
        permanent: true,
      },
      {
        source: '/learn',
        destination: '/agents',
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
            value: 'public, s-maxage=31536000, must-revalidate',
          },
        ],
      },
    ];
  },
});
