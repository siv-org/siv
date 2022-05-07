import { User } from '@supabase/supabase-js'
import { useEffect } from 'react'

import { supabase } from './supabase'

export const EmailsSent = () => {
  if (!supabase.auth.user()) return null

  const { email } = supabase.auth.user() as User

  async function getSentEmails(email?: string) {
    const { data, error } = await supabase.from('mailgun-deliveries').select('*').eq('from', email).limit(50)

    if (error) return alert(JSON.stringify(error))

    return data
  }

  useEffect(() => {
    getSentEmails(email)
  }, [email])

  return <h3>Emails sent</h3>
}
