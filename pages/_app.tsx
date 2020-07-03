import { AppProps } from 'next/app'

import React from 'react'
import 'firebase/firestore'
import 'firebase/auth'
import { Fuego, FuegoProvider } from '@nandorojo/swr-firestore'
import '../src/global.css'

const fuego = new Fuego({
  apiKey: 'AIzaSyD_B-jUzVeuYJTQafPKMmVlD4ddvNFxnfs',
  authDomain: 'siv-demo.firebaseapp.com',
  databaseURL: 'https://siv-demo.firebaseio.com',
  projectId: 'siv-demo',
  storageBucket: 'siv-demo.appspot.com',
  messagingSenderId: '902743279899',
  appId: '1:902743279899:web:28a49813a30aa6413aabbe',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FuegoProvider fuego={fuego}>
      <Component {...pageProps} />
    </FuegoProvider>
  )
}
