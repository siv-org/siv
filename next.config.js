// @ts-check
const withMDX = require('@next/mdx')()
const withTM = require('next-transpile-modules')(['lodash-es'])

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = withMDX(
  withTM({
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
  }),
)

module.exports = nextConfig
