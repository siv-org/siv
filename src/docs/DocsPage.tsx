import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'

import { HeaderBar } from './HeaderBar'
import InvalidatingVoters from './invalidating-voters.mdx'
import { onTodoPage } from './Todo'

export const DocsPage = () => {
  return (
    <>
      <Head title={`${onTodoPage() ? 'Todo' : 'Docs'}: Invalidating Voters`} />

      <HeaderBar />
      <main>
        <InvalidatingVoters />
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
