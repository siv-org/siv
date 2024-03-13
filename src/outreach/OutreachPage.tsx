import { NoSsr } from '@mui/material'
import Head from 'next/head'
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
