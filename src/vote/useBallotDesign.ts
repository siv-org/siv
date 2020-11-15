import { useEffect, useState } from 'react'

type Ballot = {
  choices: string[]
  question: string
  write_in_allowed: boolean
}

export function useBallotDesign(election_id?: string) {
  const [design, setDesign] = useState<Ballot | null>()

  async function getDesign() {
    // Wait for election_id
    if (!election_id) return

    // Ask API
    const response = await fetch(`/api/election/${election_id}/ballot-design`)
    const ballot_design = JSON.parse(await response.text())
    setDesign(ballot_design[0])
  }

  // Download question when election_id is first loaded
  useEffect(() => {
    getDesign()
  }, [election_id])

  return design
}
