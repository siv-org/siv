/* eslint-disable @typescript-eslint/no-var-requires */
const withMDX = require('@next/mdx')()
const withTM = require('next-transpile-modules')(['lodash-es'])

module.exports = withMDX(
  withTM({
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // ignoreBuildErrors: true,
    },
  }),
)
