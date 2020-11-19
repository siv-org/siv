import { useEffect, useState } from 'react'

type Item = {
  description?: string
  options: string[]
  question?: string
  title: string
  write_in_allowed: boolean
}

export function useBallotDesign(election_id?: string) {
  const [design, setDesign] = useState<Item[] | null>()

  async function getDesign() {
    // Wait for election_id
    if (!election_id) return

    // Ask API
    const response = await fetch(`/api/election/${election_id}/ballot-design`)
    const ballot_design = JSON.parse(await response.text())
    setDesign(ballot_design)
  }

  // Download question when election_id is first loaded
  useEffect(() => {
    getDesign()
  }, [election_id])

  return design
}
