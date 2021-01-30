import { Dispatch, SetStateAction, useState } from 'react'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { ElectionLabel } from './1-Label/ElectionLabel'
import { BallotDesign } from './BallotDesign/BallotDesign'
import { ElectionID } from './ElectionID'
import { HeaderBar } from './HeaderBar'
import { use_stored_info } from './load-existing'
import { AddTrustees } from './Trustees/AddTrustees'
import { AddVoters } from './Voters/AddVoters'

export type StageAndSetter = { set_stage: Dispatch<SetStateAction<number>>; stage: number }

export const AdminPage = (): JSX.Element => {
  const { ballot_design, election_manager, threshold_public_key } = use_stored_info()

  return (
    <>
      <Head title="Create new election" />

      <HeaderBar />
      <main>
        <h1>Create New Election</h1>
        <ElectionID />
        <ElectionLabel />
        {election_manager && <AddTrustees />}
        {threshold_public_key && <BallotDesign />}
        {ballot_design && <AddVoters />}
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
