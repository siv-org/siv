import '../src/reset.css'

import { AppProps } from 'next/app'

import { FirebaseProvider } from '../src/firebase'
import { GAnalytics } from '../src/gAnalytics'
import { useSentry } from '../src/sentry'

export default function App({ Component, pageProps }: AppProps) {
  useSentry()

  return (
    <FirebaseProvider>
      <Component {...pageProps} />
      <GAnalytics />
    </FirebaseProvider>
  )
}
