import _Head from 'next/head'

const card_image = `https://siv.org/preview.png`

export const Head = ({ children = <></>, title }: { children?: JSX.Element; title: string }) => {
  const full_title = `SIV: ` + title

  return (
    <_Head>
      <title key="title">{title}</title>

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
