import 'firebase/firestore'
import 'firebase/auth'

import '../src/global.css'

import { Fuego, FuegoProvider } from '@nandorojo/swr-firestore'
import { AppProps } from 'next/app'

import ContextProvider from '../src/context'

const fuego = new Fuego({
  apiKey: 'AIzaSyD_B-jUzVeuYJTQafPKMmVlD4ddvNFxnfs',
  appId: '1:902743279899:web:28a49813a30aa6413aabbe',
  authDomain: 'siv-demo.firebaseapp.com',
  databaseURL: 'https://siv-demo.firebaseio.com',
  messagingSenderId: '902743279899',
  projectId: 'siv-demo',
  storageBucket: 'siv-demo.appspot.com',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FuegoProvider fuego={fuego}>
      <ContextProvider>
        <Component {...pageProps} />
      </ContextProvider>
    </FuegoProvider>
  )
}
