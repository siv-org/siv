import { useRouter } from 'next/router'
import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'

import InvalidatingVoters from './invalidating-voters.mdx'

const DocsPage = () => {
  const { query } = useRouter()

  return (
    <main>
      <Head title={`${query?.todo !== undefined ? 'Todo' : 'Docs'}: Invalidating Voters`} />

      <InvalidatingVoters />
      <GlobalCSS />
      <style jsx>{`
        main {
          padding: 1rem;
        }
      `}</style>
    </main>
  )
}

export default DocsPage
