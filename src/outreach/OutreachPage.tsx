import { GlobalCSS } from 'src/GlobalCSS'

import { EmailsSent } from './EmailsSent'
import { LoginForm } from './LoginForm'

export const OutreachPage = () => {
  return (
    <div>
      <h1>SIV Outreach</h1>
      <LoginForm />
      <EmailsSent />

      <GlobalCSS />
      <style jsx>{`
        div {
          padding: 1rem;
        }
      `}</style>
    </div>
  )
}
