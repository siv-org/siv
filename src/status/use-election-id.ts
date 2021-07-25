import { useRouter } from 'next/router'

export const useElectionId = () => useRouter().query.election_id as string | undefined
