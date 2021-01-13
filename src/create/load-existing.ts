import { useRouter } from 'next/router'
import { Dispatch } from 'react'

import { Voters } from '../../pages/api/election/[election_id]/load-admin'
import { Voted } from './AddParticipants'

export async function load_existing_election({
  election_id,
  setElectionID,
  setPubKey,
  setVoted,
}: {
  election_id?: string
  setElectionID: Dispatch<string>
  setPubKey: Dispatch<string>
  setVoted: Dispatch<Voted>
}) {
  const { election_id: election_id_in_url } = useRouter().query as { election_id?: string }

  // Don't need to run if we weren't given election_id_in_url or we already have an election_id
  if (!election_id_in_url || election_id) return

  console.log(`Loading election '${election_id_in_url}'...`)

  const trustees_input = document.getElementById('trustees-input') as HTMLInputElement
  const voters_input = document.getElementById('voters-input') as HTMLInputElement
  const ballot_design_input = document.getElementById('ballot-design') as HTMLInputElement

  // Show 'Loading...' message
  ;[trustees_input, voters_input, ballot_design_input].forEach((input) => (input.value = 'Loading...'))

  const response = await fetch(`api/election/${election_id_in_url}/load-admin?password=${localStorage.password}`)

  // Set election ID so this call doesn't happen anymore
  setElectionID(election_id_in_url)

  // Check for fetch error
  if (response.status !== 200) {
    return console.error(await response.json())
  }

  const json = await response.json()
  console.log(json)

  // Parse data into UI
  const { ballot_design, threshold_public_key, trustees, voters } = json
  if (ballot_design) ballot_design_input.value = ballot_design
  if (trustees) trustees_input.value = trustees.join('\n')
  if (voters) {
    voters_input.value = voters.map(([email]: Voters) => email).join('\n')
    const voted: Voted = voters.reduce(
      (acc: Voted, [email, has_voted]: Voters[0]) => ({ ...acc, [email]: has_voted }),
      {},
    )
    setVoted(voted)
  }
  if (threshold_public_key) setPubKey(threshold_public_key)
}
