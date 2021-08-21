import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'

import InvalidatingVoters from './invalidating-voters.mdx'

const DocsPage = () => {
  return (
    <main>
      <Head title="Docs: Invalidating Voters" />

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
