import '../src/reset.css'

import { AppProps } from 'next/app'

import { GAnalytics } from '../src/gAnalytics'
import { useSentry } from '../src/sentry'

export default function App({ Component, pageProps }: AppProps) {
  useSentry()

  return (
    <>
      {/* Temp fix for ts bug introduced around 4/12/22 see https://stackoverflow.com/questions/71831601/ts2786-component-cannot-be-used-as-a-jsx-component or https://stackoverflow.com/questions/71843247/react-nextjs-type-error-component-cannot-be-used-as-a-jsx-component  */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Component {...pageProps} />
      <GAnalytics />
    </>
  )
}
