import { HeaderBar } from '../admin/HeaderBar'
import { useStored } from '../admin/useStored'
import { ExistingVoters } from '../admin/Voters/ExistingVoters'
import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'

export const ManagerPage = (): JSX.Element => {
  const { election_title } = useStored()

  return (
    <>
      <Head title="Election Manager" />

      <HeaderBar />
      <main>
        <h1>{election_title ? `Manage: ${election_title}` : 'Election Manager'}</h1>
        <ExistingVoters readOnly />
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
        }

        h1 {
          margin-top: 0;
          font-size: 22px;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
