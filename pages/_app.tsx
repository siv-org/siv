import '../src/reset.css'
import '../src/tailwind.css'

import { AppProps } from 'next/app'

import { useSentry } from '../src/sentry'

export default function App({ Component, pageProps }: AppProps) {
  useSentry()

  return (
    <>
      <Component {...pageProps} />
    </>
  )
}
