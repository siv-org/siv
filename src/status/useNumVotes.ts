import { NumAcceptedVotes } from "api/election/[election_id]/num-votes"

import { useSWRExponentialBackoff } from './useSWRExponentialBackoff'

export function useNumVotes(election_id?: null | string | string[]): NumAcceptedVotes {
    // Exponentially poll for num votes (just a single read)
    const { data } = useSWRExponentialBackoff(
        !election_id ? null : `/api/election/${election_id}/num-votes`,
        fetcher,
        1,
    ) as { data: NumAcceptedVotes }
    const { num_invalidated_votes = 0, num_pending_votes = 0, num_votes = 0 } = data || {}
    return { num_invalidated_votes, num_pending_votes, num_votes }
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())