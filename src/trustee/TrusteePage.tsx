import { Tab, Tabs } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useReducer } from 'react'

import { mask as maskToken } from '../admin/Voters/mask-token'
import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { ShuffleAndDecrypt } from './decrypt/ShuffleAndDecrypt'
import { getTrusteesOnInit } from './get-latest-from-server'
import { HeaderBar } from './HeaderBar'
import { Keygen } from './keygen/_Keygen'
import { initPusher } from './pusher-helper'
import { useTrusteeState } from './trustee-state'

export const TrusteePage = (): JSX.Element => {
  // Grab election parameters from URL
  const router = useRouter()
  const { auth, election_id } = router.query as { auth: string; election_id: string }
  const [masked, toggle_masked] = useReducer((state) => !state, true)

  const mask = masked ? maskToken : (s: string) => s

  const tab = router.isReady && document?.location?.hash === '#after' ? 1 : 0

  return (
    <>
      <Head title="Observer" />

      <HeaderBar />
      <main>
        <p>
          Election ID: <b>{election_id}</b>
          <br />
          Auth:{' '}
          <b className="clickable" onClick={toggle_masked}>
            {mask(auth || '')}
          </b>
        </p>

        <Tabs
          indicatorColor="primary"
          style={{ margin: '1rem 0' }}
          textColor="primary"
          value={tab}
          onChange={(_, newValue) => router.push(`#${newValue ? 'after' : 'before'}`)}
        >
          <Tab label="Before Election" />
          <Tab label="After Election" />
        </Tabs>

        {!(election_id && auth) ? <p>Need election_id and auth</p> : <ClientOnly {...{ auth, election_id }} />}
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
          overflow-wrap: break-word;
        }

        .clickable {
          cursor: pointer;
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

const ClientOnly = ({ auth, election_id }: { auth: string; election_id: string }) => {
  // Initialize local vote state on client
  const [state, dispatch] = useTrusteeState({ auth, election_id })

  // Get initial Trustee info
  getTrusteesOnInit({ dispatch, state })

  // Activate Pusher to get updates from the server on new data
  initPusher({ dispatch, state })

  return (
    <>
      {document.location.hash !== '#after' ? (
        <Keygen {...{ dispatch, state }} />
      ) : (
        <ShuffleAndDecrypt {...{ dispatch, state }} />
      )}
    </>
  )
}
