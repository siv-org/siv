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
      <input onChange={({ target }) => setEmail(target.value)} placeholder="you@email.com" type="text" value={email} />

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
