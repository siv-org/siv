import { NoSsr, TextField } from '@material-ui/core'
import { createClient } from '@supabase/supabase-js'
import { firestore } from 'firebase/app'
import { useState } from 'react'

import { api } from '../api-helper'
import { OnClickButton } from './Button'

const supabaseUrl = 'https://ktoemmjtpzoqhunxvabf.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMjg0ODgxMiwiZXhwIjoxOTI4NDI0ODEyfQ.CGcmI1V3Wwm9JdQtalhatkLNODRw9mTRJLf-m3sra_w'
const supabase = createClient(supabaseUrl, SUPABASE_KEY)

export const EmailSignup = (): JSX.Element => {
  const [saved, setSaved] = useState(false)

  return (
    <>
      <h3>The Future of Voting</h3>
      <p>Sign up to receive occasional updates</p>

      <div style={{ display: 'flex', marginTop: 15 }}>
        <NoSsr>
          <TextField
            id="newsletter-signup-field"
            label="Email Address"
            size="small"
            style={{ flex: 1, marginRight: 10, maxWidth: 250 }}
            variant="outlined"
            onChange={() => setSaved(false)}
          />
        </NoSsr>
        <OnClickButton
          disabled={saved}
          style={{ margin: 0, padding: '8px 17px' }}
          onClick={async () => {
            const email = (document.getElementById('newsletter-signup-field') as HTMLInputElement).value

            // Store submission in DB
            const { data, error } = await supabase.from('newsletter').insert([{ email }])

            console.log({ data, error })
            if (error) throw error

            setSaved(true)

            // Notify via Pushover
            api('pushover', {
              message: email,
              title: `SIV newsletter signup`,
            })
          }}
        >
          {saved ? 'Done!' : 'Sign Up'}
        </OnClickButton>
      </div>
      <style jsx>{`
        h3 {
          font-weight: 400;
          font-size: 28px;
        }

        p {
          font-size: 16px;
        }
      `}</style>
    </>
  )
}
