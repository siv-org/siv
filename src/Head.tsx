import _Head from 'next/head'

const card_image = `https://secureinternetvoting.org/preview.png`

export const Head = ({ children = <></>, title }: { children?: JSX.Element; title: string }) => {
  const full_title = `SIV: ` + title

  return (
    <_Head>
      <title key="title">{full_title}</title>
      <link href="/favicon.png" rel="icon" />

      <meta content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" name="viewport" />

      {/* For Facebook & iMessage */}
      <meta content={card_image} property="og:image" />
      <meta content={full_title} property="og:title" />

      {/* For twitter */}
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="@dsernst" name="twitter:creator" />
      <meta content={full_title} name="twitter:title" />
      <meta content={card_image} name="twitter:image" />

      {children}
    </_Head>
  )
}
