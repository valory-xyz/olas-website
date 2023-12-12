module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['cms-backend.autonolas.tech'],
  },
  async redirects() {
    return [
      {
        source: '/whitepaper',
        destination: 'https://autonolas.network/whitepaper',
        permanent: false, // to be updated once autonolas.network has been changed
      },
    ]
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
    ];
  },
};
