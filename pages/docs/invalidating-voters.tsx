import { GlobalCSS } from 'src/GlobalCSS'

import InvalidatingVoters from './invalidating-voters.mdx'

const DocsPage = () => {
  return (
    <main>
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
