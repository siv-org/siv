import '../src/global.css'

import { AppProps } from 'next/app'

import ContextProvider from '../src/context'
import { FirebaseProvider } from '../src/firebase'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FirebaseProvider>
      <ContextProvider>
        <Component {...pageProps} />
      </ContextProvider>
    </FirebaseProvider>
  )
}
