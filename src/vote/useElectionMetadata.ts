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
    // Use the provided host or current domain dynamically, fallback to localhost for SSR
    const baseUrl = host
      ? `https://${host}`
      : typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Generate OG image URL
    const ogImageUrl = election_id
      ? `${baseUrl}/api/election/${election_id}/og-image?election_id=${election_id}`
      : `${baseUrl}/default-election-og.png`

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
      ogImage: ogImageUrl,
      ogUrl: election_id ? `${baseUrl}/election/${election_id}/vote` : baseUrl,
      title: election_title ? `${election_title} - Secure Internet Voting` : 'Secure Internet Voting - Cast Your Vote',
    }
  }, [election_id, election_title, ballot_design])
}
