import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { supabase } from './supabase'

export const EmailsSent = () => {
  if (!supabase.auth.user()) return null

  const { email } = supabase.auth.user() as User
  const [emails, setEmails] = useState([])

  async function getSentEmails(email?: string) {
    const { data, error } = await supabase
      .from('mailgun-deliveries')
      .select('*')
      .eq('from', email)
      .order('id', { ascending: false })
      .limit(50)

    if (error) return alert(JSON.stringify(error))

    setEmails(data as never)
  }

  useEffect(() => {
    getSentEmails(email)
  }, [email])

  return (
    <>
      <h3>Emails sent</h3>
      <div className="header">
        <div style={{ width: 170 }}>created_at</div>
        <div style={{ width: 120 }}>from</div>
        <div style={{ width: 200 }}>to</div>
        <div style={{ width: 200 }}>subject</div>
      </div>

      <ul>
        {emails.map((email) => {
          const { created_at, from, subject, to } = email
          return (
            <li key={created_at}>
              <div style={{ width: 170 }}>{new Date(created_at).toLocaleString()}</div>
              <div style={{ width: 120 }}>{from}</div>
              <div style={{ width: 200 }}>{to}</div>
              <div style={{ width: 200 }}>{subject}</div>
              <div>
                <a onClick={() => alert(JSON.stringify(email))}>full json</a>
              </div>
            </li>
          )
        })}
      </ul>

      <style jsx>{`
        ul {
          padding-inline: 0;
          margin-top: 0;
        }

        .header {
          opacity: 0.3;
        }

        li {
          list-style-type: none;
        }

        .header div,
        li div {
          overflow: scroll;
          display: inline-block;
          white-space: nowrap;

          margin-left: 20px;
        }

        li div::-webkit-scrollbar {
          display: none;
        }

        .header div:first-child,
        li div:first-child {
          margin-left: 0;
        }
      `}</style>
    </>
  )
}
