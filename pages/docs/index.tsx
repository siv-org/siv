export { DocsIndexPage as default } from 'src/docs/DocsIndexPage'

import { promises as fs } from 'fs'
import { GetStaticProps } from 'next'
import path from 'path'

export type DocsIndexPageProps = { files: string[] }
export const getStaticProps: GetStaticProps<DocsIndexPageProps> = async () => {
  const files = (await fs.readdir(path.join(__dirname, '../../../src/docs')))
    .filter((file) => file.endsWith('.mdx'))
    .map((f) => f.slice(0, -4)) // remove .mdx

  return {
    props: { files },
  }
}
