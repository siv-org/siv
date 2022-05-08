import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { supabase } from './supabase'

type EmailDelivery = {
  created_at: string
  from?: string
  id: number
  json: { 'event-data': { message: { headers: { 'message-id': string } } } }
  subject: string
  to: string
}

export const EmailsSent = () => {
  if (!supabase.auth.user()) return null

  const { email } = supabase.auth.user() as User
  const [emails, setEmails] = useState<EmailDelivery[]>([])

  async function getSentEmails(email?: string) {
    const { data, error } = await supabase
      .from<EmailDelivery>('mailgun-deliveries')
      .select('*')
      .eq('from', email)
      .order('id', { ascending: false })
      .limit(50)

    if (error) return alert(JSON.stringify(error))

    setEmails(data)
  }

  useEffect(() => {
    getSentEmails(email)
  }, [email])

  return (
    <>
      <h3>Emails sent</h3>
      <label>
        <div style={{ width: 170 }}>created_at</div>
        <div style={{ width: 120 }}>from</div>
        <div style={{ width: 200 }}>to</div>
        <div style={{ width: 200 }}>subject</div>
      </label>

      <ul>
        {emails.map((email) => {
          const { created_at, from, json, subject, to } = email
          return (
            <li key={created_at}>
              <div style={{ width: 170 }}>{new Date(created_at).toLocaleString()}</div>
              <div style={{ width: 120 }}>{from}</div>
              <div style={{ width: 200 }}>{to}</div>
              <div style={{ width: 200 }}>{subject}</div>
              <div>
                <a onClick={() => alert(JSON.stringify(email))}>json</a>
              </div>
              <div>
                <a onClick={() => alert(json['event-data'].message.headers['message-id'])}>opens</a>
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

        label {
          opacity: 0.3;
        }

        li {
          list-style-type: none;
        }

        label div,
        li div {
          overflow: scroll;
          display: inline-block;
          white-space: nowrap;

          margin-left: 20px;
        }

        li div::-webkit-scrollbar {
          display: none;
        }

        label div:first-child,
        li div:first-child {
          margin-left: 0;
        }

        a {
          cursor: pointer;
        }
      `}</style>
    </>
  )
}
