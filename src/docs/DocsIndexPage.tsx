import { startCase } from 'lodash-es'
import Link from 'next/link'
import { DocsIndexPageProps } from 'pages/docs'
import { GlobalCSS } from 'src/GlobalCSS'

export const DocsIndexPage = ({ files }: DocsIndexPageProps) => {
  return (
    <main className="p-4">
      <h1>SIV Docs</h1>
      <h3>Pages:</h3>
      <ul>
        {files.map((file) => (
          <li key={file}>
            <Link href={`docs/${file}`}>{startCase(file)}</Link>
          </li>
        ))}
      </ul>

      <GlobalCSS />
    </main>
  )
}
