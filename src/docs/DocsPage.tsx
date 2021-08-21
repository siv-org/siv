import { startCase } from 'lodash-es'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'

import { HeaderBar } from './HeaderBar'
import { onTodoPage } from './Todo'

export const DocsPage = () => {
  const { doc } = useRouter().query

  if (typeof doc !== 'string') return null

  const Doc = dynamic(() => import(`./${doc}.mdx`))

  return (
    <>
      <Head title={`${onTodoPage() ? 'Todo' : 'Docs'}: ${startCase(doc)}`} />

      <HeaderBar />
      <main>
        <Doc />
      </main>
      <GlobalCSS />
      <style jsx>{`
        main {
          padding: 1rem;

          margin: 0 auto;
          max-width: 800px;
        }
      `}</style>
    </>
  )
}
