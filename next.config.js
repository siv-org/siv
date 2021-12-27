// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const withMDX = require('@next/mdx')()
const withTM = require('next-transpile-modules')(['lodash-es'])

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = withMDX(
  withTM({
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // ignoreBuildErrors: true,
    },
  }),
)

module.exports = nextConfig
