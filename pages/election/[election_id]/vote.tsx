import { GetServerSideProps } from 'next'

import { VotePage } from '../../../src/vote/VotePage'

interface VotePageWrapperProps {
  host: string
}

export default function VotePageWrapper(props: VotePageWrapperProps) {
  return <VotePage {...props} />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params, req } = context
  const host = req.headers.host || 'localhost:3000'
  const election_id = params?.election_id as string

  let electionData = {}

  if (election_id) {
    try {
      const baseUrl = req.headers.host?.includes('localhost') ? 'http://localhost:3000' : `https://${host}`
      const response = await fetch(`${baseUrl}/api/election/${election_id}/info`)
      if (response.ok) {
        const data = await response.json()
        if (!data.error) {
          electionData = {
            ballot_design: data.ballot_design,
            election_title: data.election_title,
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch election data in getServerSideProps:', error)
    }
  }

  return {
    props: {
      electionData,
      host,
    },
  }
}
