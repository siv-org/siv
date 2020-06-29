// eslint-disable-next-line @typescript-eslint/no-var-requires
const mdx = require('@next/mdx')

const withMDX = mdx({
  extension: /\.mdx?$/,
})
module.exports = withMDX({
  pageExtensions: ['md', 'mdx', 'tsx'],
})
