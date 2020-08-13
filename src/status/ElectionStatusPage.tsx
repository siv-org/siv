import { useRouter } from 'next/router'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'

export const ElectionStatusPage = (): JSX.Element => {
  const router = useRouter()
  const { election_id } = router.query
  return (
    <>
      <Head title="Election Status" />

      <main>
        <h1>Election Status</h1>
        <h2>ID: {election_id}</h2>
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
