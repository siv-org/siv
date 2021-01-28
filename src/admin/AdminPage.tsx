import { Dispatch, SetStateAction, useState } from 'react'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { BallotDesign } from './BallotDesign/BallotDesign'
import { ElectionID } from './ElectionID'
import { HeaderBar } from './HeaderBar'
import { load_stage } from './load-existing'
import { ElectionTitle } from './Title/ElectionTitle'
import { AddTrustees } from './Trustees/AddTrustees'
import { AddVoters } from './Voters/AddVoters'

export type StageAndSetter = { set_stage: Dispatch<SetStateAction<number>>; stage: number }

export const AdminPage = (): JSX.Element => {
  const [stage, set_stage] = useState(0)

  load_stage({ set_stage, stage })

  return (
    <>
      <Head title="Create new election" />

      <HeaderBar />
      <main>
        <h1>Create New Election</h1>
        <ElectionID />
        <ElectionTitle {...{ set_stage, stage }} />
        {stage >= 1 && <AddTrustees {...{ set_stage, stage }} />}
        {stage >= 2 && <BallotDesign {...{ set_stage, stage }} />}
        {stage >= 3 && <AddVoters />}
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
