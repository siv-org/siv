import { GlobalCSS } from 'src/GlobalCSS'

import { LoginForm } from './LoginForm'

export const OutreachPage = () => {
  return (
    <div>
      <h1>Outreach page</h1>
      <LoginForm />

      <GlobalCSS />
      <style jsx>{`
        div {
          padding: 1rem;
        }
      `}</style>
    </div>
  )
}
