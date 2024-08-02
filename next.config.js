module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['cms-backend.autonolas.tech'],
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
        destination: 'https://github.com/contentwillvary/brand-and-press-kit-olas/blob/main/README.md',
        permanent: false,
      },
      {
        source: '/services/predict',
        destination: '/agent-economies/predict',
        permanent: true,
      },
      {
        source: '/contribute',
        destination: '/services/contribute',
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
};
