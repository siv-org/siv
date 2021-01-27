import { useState } from 'react'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { AddVoters } from './AddVoters'
import { ElectionTitleInput } from './ElectionTitleInput'
import { ExistingVoters } from './ExistingVoters'
import { HeaderBar } from './HeaderBar'

export const AdminPage = (): JSX.Element => {
  const [stage, set_stage] = useState(0)

  return (
    <>
      <Head title="Create new election" />

      <HeaderBar />
      <main>
        <h1>Create New Election</h1>
        <ElectionTitleInput {...{ set_stage, stage }} />
        {stage >= 1 && (
          <>
            <AddVoters />
            <ExistingVoters />
          </>
        )}
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

        h2 {
          font-size: 18px;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
