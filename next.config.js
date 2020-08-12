// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTM = require('next-transpile-modules')(['lodash-es'])

module.exports = withTM({
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // ignoreBuildErrors: true,
  },
})
