import '../src/global.css'

import { AppProps } from 'next/app'

import { FirebaseProvider } from '../src/firebase'
import { ScrollContextProvider } from '../src/scroll-context'
import { VoteContextProvider } from '../src/vote-context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FirebaseProvider>
      <VoteContextProvider>
        <ScrollContextProvider>
          <Component {...pageProps} />
        </ScrollContextProvider>
      </VoteContextProvider>
    </FirebaseProvider>
  )
}
