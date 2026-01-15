// @ts-check
const webpack = require('webpack')
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
      {
        destination: 'https://siv.org/election/1759241141808/vote?auth=link',
        permanent: true,
        source: '/evoteid',
      },
      {
        destination: 'https://blog.siv.org/2025/08/overrides',
        permanent: true,
        source: '/overrides',
      },
      {
        destination: '/browser-storage',
        permanent: true,
        source: '/show-browser-storage',
      },
      {
        destination: '/browser-storage',
        permanent: true,
        source: '/view-browser-storage',
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
  webpack: (config) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource) {
          return /\.test\.(ts|tsx)$/.test(resource)
        },
      }),
    )
    return config
  },
})

module.exports = nextConfig
