import Head from 'next/head'
import Link from 'next/link'

import { usePusher } from './usePusher'
import { useStored } from './useStored'

export const ElectionID = () => {
  const { election_id, election_title } = useStored()
  usePusher(election_id)

  if (!election_id) return null

  return (
    <div>
      <Head>
        <title key="title">SIV: Manage {election_title}</title>
      </Head>
      Election ID:{' '}
      <Link as={`/election/${election_id}`} href="/election/[election_id]">
        <a target="_blank">{election_id}</a>
      </Link>
      <style jsx>{`
        div {
          float: right;
          opacity: 0.5;

          position: relative;
          bottom: 37px;
        }

        a {
          font-weight: bold;
          color: black;
        }

        @media (max-width: 480px) {
          div {
            float: none;
            bottom: 0;
          }
        }
      `}</style>
    </div>
  )
}
