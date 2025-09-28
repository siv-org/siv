// @ts-check
const withMDX = require('@next/mdx')()

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = withMDX({
  async redirects() {
    return [
      {
        destination: 'https://docs.siv.org/research-in-progress/ukraine',
        permanent: true,
        source: '/ukraine',
      },
      {
        destination: 'https://docs.siv.org/compare',
        permanent: true,
        source: '/compare',
      },
    ]
  },
  transpilePackages: ['lodash-es'],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // ignoreBuildErrors: true,
  },
})

module.exports = nextConfig
