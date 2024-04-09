import Head from 'next/head'
import { NoSsr } from 'src/_shared/NoSsr'
import { GlobalCSS } from 'src/GlobalCSS'

import { EmailsSent } from './EmailsSent'
import { LoginForm } from './LoginForm'

export const OutreachPage = () => {
  return (
    <div>
      <Head>
        <title>SIV Outreach</title>
      </Head>

      <h1>SIV Outreach</h1>

      <NoSsr>
        <LoginForm />
        <EmailsSent />
      </NoSsr>

      <GlobalCSS />
      <style jsx>{`
        div {
          padding: 1rem;
        }
      `}</style>
    </div>
  )
}
