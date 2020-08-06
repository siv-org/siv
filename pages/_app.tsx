import '../src/global.css'

import { AppProps } from 'next/app'

import { FirebaseProvider } from '../src/firebase'
import { GAnalytics } from '../src/gAnalytics'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FirebaseProvider>
      <Component {...pageProps} />
      <GAnalytics />
    </FirebaseProvider>
  )
}
