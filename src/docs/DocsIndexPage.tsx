import { startCase } from 'lodash-es'
import Link from 'next/link'
import { DocsIndexPageProps } from 'pages/docs'
import { GlobalCSS } from 'src/GlobalCSS'

export const DocsIndexPage = ({ files }: DocsIndexPageProps) => {
  return (
    <main>
      <h1>SIV Docs</h1>
      <h3>Pages:</h3>
      <ul>
        {files.map((file) => (
          <li key={file}>
            <Link href={`docs/${file}`}>
              <a>{startCase(file)}</a>
            </Link>
          </li>
        ))}
      </ul>
      <style jsx>{`
        main {
          padding: 1rem;
        }
      `}</style>
      <GlobalCSS />
    </main>
  )
}
