import { useMemo } from 'react'

export function useElectionMetadata(
  election_id?: string,
  election_title?: string,
  ballot_design?: Array<{ options: Array<{ name: string }>; title: string }>,
  host?: string,
): {
  description: string
  ogImage: string
  ogUrl: string
  title: string
} {
  return useMemo(() => {
    if (!election_id)
      return {
        description: 'Vote Now',
        ogImage: '/default-election-og.png',
        ogUrl: 'https://siv.vote',
        title: 'Secure Internet Voting - Cast Your Vote',
      }

    // Use the provided host or current domain dynamically, fallback to localhost for SSR
    const baseUrl = host
      ? `https://${host}`
      : typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Get first question for description
    const firstQuestion = ballot_design?.[0]
    const questionTitle = firstQuestion?.title || 'Vote Now'
    const options = firstQuestion?.options || []

    // Create dynamic description
    const description =
      options.length > 0
        ? `Vote on: ${questionTitle} - Options: ${options
            .slice(0, 3)
            .map((opt: { name: string }) => opt.name)
            .join(', ')}${options.length > 3 ? '...' : ''}`
        : 'Participate in secure, verifiable online voting. Your vote is encrypted and protected.'

    return {
      description,
      ogImage: `${baseUrl}/api/election/${election_id}/og-image`,
      ogUrl: `${baseUrl}/election/${election_id}/vote`,
      title: election_title ? `${election_title} - Secure Internet Voting` : 'Secure Internet Voting - Cast Your Vote',
    }
  }, [election_id, election_title, ballot_design])
}
