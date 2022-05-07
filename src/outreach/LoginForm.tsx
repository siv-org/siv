import { useState } from 'react'

import { supabase } from './supabase'

export const LoginForm = () => {
  const [email, setEmail] = useState('')

  if (supabase.auth.user())
    return (
      <>
        Current user: <em>{supabase.auth.user()?.email}</em>
      </>
    )

  return (
    <div>
      <input placeholder="you@email.com" type="text" value={email} onChange={({ target }) => setEmail(target.value)} />

      <button
        onClick={async () => {
          const { error } = await supabase.auth.signIn({ email })

          if (error) return alert(`ERROR: ${JSON.stringify(error)}`)

          alert(`Login link sent to ${email}`)
        }}
      >
        Login
      </button>
      <style jsx>{`
        input,
        button {
          font-size: 20px;
        }
      `}</style>
    </div>
  )
}
