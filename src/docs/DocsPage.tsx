import { useRouter } from 'next/router'
import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'

import { HeaderBar } from './HeaderBar'
import InvalidatingVoters from './invalidating-voters.mdx'

export const DocsPage = () => {
  const { query } = useRouter()

  return (
    <>
      <Head title={`${query?.todo !== undefined ? 'Todo' : 'Docs'}: Invalidating Voters`} />

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
