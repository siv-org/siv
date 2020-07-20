import { TextField } from '@material-ui/core'
import { firestore } from 'firebase/app'
import { useState } from 'react'

import { OnClickButton } from './Button'
import { consultation_link } from './ForGovernments'

const email = 'questions@secureinternetvoting.org'

export const Footer = (): JSX.Element => {
  const [saved, setSaved] = useState(false)

  return (
    <div className="container">
      <div className="column">
        <h3 style={{ fontWeight: 400 }}>Democracy Knowledge & News</h3>
        <p>Sign up with your email to receive occasional updates.</p>

        <div style={{ display: 'flex', marginTop: 24 }}>
          <TextField
            id="newsletter-signup-field"
            label="Email Address"
            onChange={() => setSaved(false)}
            size="small"
            style={{ flex: 1, marginRight: 10, maxWidth: 250 }}
            variant="outlined"
          />
          <OnClickButton
            disabled={saved}
            onClick={() => {
              const fields = {
                created_at: new Date().toString(),
                email: (document.getElementById('newsletter-signup-field') as HTMLInputElement).value,
              }

              // Store submission in Firestore
              firestore()
                .collection('news-signups')
                .doc(new Date().toISOString() + ' ' + String(Math.random()).slice(2, 7))
                .set(fields)
                .then(() => {
                  setSaved(true)

                  // Notify via Pushover
                  fetch('/api/pushover', {
                    body: JSON.stringify({
                      message: fields.email,
                      title: `SIV newsletter signup`,
                    }),
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    method: 'POST',
                  })
                })
            }}
            style={{ margin: 0, padding: '8px 17px' }}
          >
            {saved ? 'Done!' : 'Sign Up'}
          </OnClickButton>
        </div>
      </div>
      <div className="column right-aligned">
        <h3>SIV</h3>
        <p>
          <a className="styled-link" href="/">
            Study Protocol
          </a>
          <br />
          <a className="styled-link" href={consultation_link}>
            For Governments
          </a>
        </p>
        <p>
          <a href={`mailto:${email}`}>{email}</a>
        </p>
      </div>
      <style jsx>{`
        .container {
          padding: 3rem;
          display: flex;
          justify-content: space-between;
        }

        .column:first-child {
          margin-right: 15%;
        }

        .right-aligned {
          text-align: right;
        }

        a {
          color: #000;
        }

        a.styled-link {
          text-decoration: none;
          font-weight: bold;
        }

        a.styled-link:hover {
          text-decoration: underline;
        }

        /* Small screens: reduce horiz padding */
        @media (max-width: 750px) {
          .container {
            padding: 17px 6vw;
            flex-direction: column;
          }

          .column:first-child {
            margin: 0;
            margin-bottom: 3rem;
          }

          .right-aligned {
            text-align: left;
          }
        }
      `}</style>
    </div>
  )
}
