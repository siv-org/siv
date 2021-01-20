import { Tab, Tabs } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { HeaderBar } from '../create/HeaderBar'
import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { ShuffleAndDecrypt } from './close/ShuffleAndDecrypt'
import { Keygen } from './keygen/_Keygen'

export const TrusteePage = (): JSX.Element => {
  // Grab election parameters from URL
  const { election_id, trustee_auth } = useRouter().query as { election_id?: string; trustee_auth?: string }

  const [tab, setTab] = useState(0)

  return (
    <>
      <Head title="Unlock Votes" />

      <HeaderBar />
      <main>
        <p>
          Election ID: <b>{election_id}</b>
          <br />
          Trustee auth: <b>{trustee_auth}</b>
        </p>

        <Tabs
          indicatorColor="primary"
          style={{ margin: '1rem 0' }}
          textColor="primary"
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
        >
          <Tab label="Before Election" />
          <Tab label="After Election" />
        </Tabs>

        {!(election_id && trustee_auth) ? (
          <p>Need election_id and trustee_auth</p>
        ) : tab === 0 ? (
          <Keygen {...{ election_id, trustee_auth }} />
        ) : (
          <ShuffleAndDecrypt {...{ election_id, trustee_auth }} />
        )}
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
          overflow-wrap: break-word;
        }
      `}</style>
      <style global jsx>{`
        h3 {
          margin-top: 2.5rem;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
