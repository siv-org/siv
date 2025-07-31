import _Head from 'next/head'

export const Head = ({
  children = <></>,
  description,
  image_preview_url = `https://siv.org/preview.png`,
  title,
}: {
  children?: JSX.Element
  description?: string
  image_preview_url?: string
  title: string
}) => {
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
      <meta content={image_preview_url} property="og:image" />
      <meta content={full_title} property="og:title" />

      {/* For twitter */}
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="@dsernst" name="twitter:creator" />
      <meta content={full_title} name="twitter:title" />
      <meta content={image_preview_url} name="twitter:image" />

      {/* Optional description for link previews */}
      {description && (
        <>
          <meta content={description} name="description" />
          <meta content={description} property="og:description" />
          <meta content={description} name="twitter:description" />
        </>
      )}

      {children}
    </_Head>
  )
}
