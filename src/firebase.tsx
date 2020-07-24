import 'firebase/firestore'
import 'firebase/auth'

import { Fuego, FuegoProvider } from '@nandorojo/swr-firestore'

const fuego = new Fuego({
  apiKey: 'AIzaSyD_B-jUzVeuYJTQafPKMmVlD4ddvNFxnfs',
  appId: '1:902743279899:web:28a49813a30aa6413aabbe',
  authDomain: 'siv-demo.firebaseapp.com',
  databaseURL: 'https://siv-demo.firebaseio.com',
  messagingSenderId: '902743279899',
  projectId: 'siv-demo',
  storageBucket: 'siv-demo.appspot.com',
})

export const FirebaseProvider = ({ children }: { children: JSX.Element }) => (
  <FuegoProvider fuego={fuego}>{children}</FuegoProvider>
)
