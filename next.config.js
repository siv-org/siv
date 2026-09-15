// @ts-check
const os = require('os')
const webpack = require('webpack')
const withMDX = require('@next/mdx')()

/** LAN IPs so phone/dev over http://192.168… can use HMR (else ~40s full reloads). */
const lanHosts = () => {
  try {
    return Object.values(os.networkInterfaces())
      .flat()
      .filter((i) => i && !i.internal && (i.family === 'IPv4' || i.family === 4))
      .map((i) => i.address)
  } catch {
    return ['192.168.4.124'] // fallback if os.networkInterfaces is unavailable
  }
}

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = withMDX({
  allowedDevOrigins: lanHosts(),
  devIndicators: false,
  images: { localPatterns: [{ pathname: '/_next/static/media/**' }, { pathname: '/logo.png' }] },
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
