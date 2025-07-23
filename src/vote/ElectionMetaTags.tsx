import Head from 'next/head'

import { useElectionMetadata } from './useElectionMetadata'

interface ElectionMetaTagsProps {
  ballot_design?: Array<{ options: Array<{ name: string }>; title: string }>
  election_id?: string
  election_title?: string
  host?: string
}

export function ElectionMetaTags({ ballot_design, election_id, election_title, host }: ElectionMetaTagsProps) {
  const metadata = useElectionMetadata(election_id, election_title, ballot_design, host)

  return (
    <Head>
      <title>{metadata.title}</title>
      <meta content={metadata.description} name="description" />

      {/* Favicons */}
      <link href="/apple-touch-icon.png?v=2" rel="apple-touch-icon" sizes="180x180" />
      <link href="/favicon-32x32.png?v=2" rel="icon" sizes="32x32" type="image/png" />
      <link href="/favicon-16x16.png?v=2" rel="icon" sizes="16x16" type="image/png" />
      <link href="/site.webmanifest?v=2" rel="manifest" />
      <link color="#5bbad5" href="/safari-pinned-tab.svg?v=2" rel="mask-icon" />
      <link href="/favicon.ico?v=2" rel="shortcut icon" />
      <meta content="Elections" name="apple-mobile-web-app-title" />
      <meta content="Elections" name="application-name" />
      <meta content="#2b5797" name="msapplication-TileColor" />
      <meta content="#ffffff" name="theme-color" />
      <meta content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" name="viewport" />

      {/* Open Graph - Signal friendly */}
      <meta content={metadata.description} property="og:description" />
      <meta content={metadata.ogImage} property="og:image" />
      <meta content="630" property="og:image:height" />
      <meta content="1200" property="og:image:width" />
      <meta content="image/png" property="og:image:type" />
      <meta content={metadata.title} property="og:title" />
      <meta content="website" property="og:type" />
      <meta content={metadata.ogUrl} property="og:url" />
      <meta content="Secure Internet Voting" property="og:site_name" />

      {/* Twitter */}
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="@dsernst" name="twitter:creator" />
      <meta content={metadata.description} name="twitter:description" />
      <meta content={metadata.ogImage} name="twitter:image" />
      <meta content={metadata.title} name="twitter:title" />

      {/* Additional Signal-friendly tags */}
      <meta content="Secure Internet Voting" name="application-name" />
      <meta content="Secure Internet Voting" name="apple-mobile-web-app-title" />
    </Head>
  )
}
