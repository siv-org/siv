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
    ]
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // ignoreBuildErrors: true,
  },
  transpilePackages: ['lodash-es'],
})

module.exports = nextConfig
