import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'

import { supabase } from './supabase'

type EmailDelivery = {
  created_at: string
  from?: string
  id: number
  json: { 'event-data': { message: { headers: { 'message-id': string } }; recipient: string } }
  subject: string
  to: string
}
type Opens = Record<string, string[]>
const loadingMsg = '...'

type OpensById = Record<string, Opens>

export const EmailsSent = () => {
  if (!supabase.auth.user()) return null

  const { email } = supabase.auth.user() as User
  const [emails, setEmails] = useState<EmailDelivery[]>([])
  const [opensById, setOpens] = useState<OpensById>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

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

  async function getOpens(messageId: string) {
    const newLoading = { ...loading }
    newLoading[messageId] = true
    setLoading(newLoading)

    const response = await api(`/outreach/get-opens-for-sender?messageId=${messageId}`)
    const { opens }: { opens: Opens } = await response.json()

    const newOpens = { ...opensById }
    newOpens[messageId] = opens
    setOpens(newOpens)
  }

  useEffect(() => {
    getSentEmails(email)
  }, [email])

  return (
    <>
      <h3>Emails sent</h3>
      <label>
        <div style={{ width: 30 }}>#</div>
        <div style={{ width: 170 }}>created_at</div>
        <div style={{ width: 120 }}>from</div>
        <div style={{ width: 200 }}>recipient</div>
        <div style={{ width: 40 }}>opens</div>
        <div style={{ width: 250 }}>subject</div>
      </label>

      <ul>
        {emails.map((email, index) => {
          const { created_at, from, json, subject } = email
          const { recipient } = json['event-data']

          const messageId = json['event-data'].message.headers['message-id']
          const prevMessageId = emails[index - 1]?.json['event-data'].message.headers['message-id']
          const isNewMessageId = messageId !== prevMessageId

          const opens = opensById[messageId]
          const isLoading = loading[messageId]

          return (
            <li className={isNewMessageId ? 'first' : ''} key={created_at}>
              <div style={{ width: 30 }}>{index + 1}</div>
              <div style={{ width: 170 }}>{new Date(created_at).toLocaleString()}</div>
              <div style={{ width: 120 }}>{from}</div>
              <div style={{ width: 200 }}>{recipient}</div>
              <div style={{ width: 40 }}>
                {opens ? (
                  ((opensById[messageId] as Opens)[recipient] || []).length
                ) : isLoading ? (
                  loadingMsg
                ) : (
                  <a onMouseEnter={() => getOpens(messageId)}>load</a>
                )}
              </div>
              <div style={{ width: 250 }}>{subject}</div>
              <div>
                <a onClick={() => alert(JSON.stringify(email))}>json</a>
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

        li.first {
          border-top: 1px solid #ddd;
          padding-top: 5px;
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
