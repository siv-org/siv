import { TextField, TextFieldProps } from '@mui/material'
import { useCallback, useState } from 'react'
import { Row } from 'src/_shared/Forms/Row'
import { NoSsr } from 'src/_shared/NoSsr'

import { FormSubmitBtns } from './FormSubmitBtns'

export const IfNoForm = ({ id }: { id?: string }) => {
  const [saved, setSaved] = useState(false)
  const [showBottom, setShowBottom] = useState(false)
  // const [error, setError] = useState('')
  const [stayUpdated, setStayUpdated] = useState(false)

  // DRY-up TextField
  const Field = useCallback(
    (props: TextFieldProps) => (
      <NoSsr>
        <TextField
          onChange={() => setSaved(false)}
          size="small"
          variant="outlined"
          {...props}
          id={props.id}
          style={{ ...props.style }}
        />
      </NoSsr>
    ),
    [],
  )

  return (
    <form autoComplete="off">
      <Row>
        <Field fullWidth id="reason" label="What is the reason/concern?" multiline rows={4} />
      </Row>
      <Row style={{ marginBottom: 15 }} />

      <Row style={{ marginBottom: 0 }}>
        <Field fullWidth id="email" label="Your Email (if you'd like a reply)" />
      </Row>
      <Row style={{ marginTop: 10 }}>
        <label>
          <input checked={stayUpdated} onClick={() => setStayUpdated(!stayUpdated)} readOnly type="checkbox" />
          Keep me updated
        </label>
      </Row>

      <FormSubmitBtns
        fields={{ id, stayUpdated }}
        formFieldNames={['reason', 'email']}
        {...{ saved, setSaved, setShowBottom }}
      />

      {/* Bottom part */}
      {showBottom && (
        <>
          <h2>Thank you for your time!</h2>

          <p className="learnmore-text">
            <i>Learn more:</i>
          </p>
          <div className="learnmore">
            <p>
              <a href="https://siv.org/">Homepage</a>
            </p>
            <p>
              <a href="https://siv.org/protocol">SIV Protocol</a>
            </p>
            <p>
              <a href="https://siv.org/faq">FAQ</a>
            </p>
            <p>
              <a href="https://blog.siv.org/2022/04/top-internet-voting-concerns">Solutions to Top Concerns</a>
            </p>
          </div>
        </>
      )}

      <style jsx>{`
        .error {
          color: red;
          position: relative;
          bottom: 6rem;
        }

        h2 {
          text-align: center;
          margin-top: 5rem;
        }
        p {
          text-align: center;
        }
        .learnmore-text {
          color: grey;
          opacity: 70%;
        }
        .learnmore {
          display: flex;
          justify-content: space-around;
        }

        .learnmore a {
          font-weight: 600;
        }

        input[type='checkbox'] {
          margin-right: 15px;
          transform: scale(1.2);
        }

        @media (max-width: 700px) {
          .learnmore {
            flex-direction: column;
          }
        }
      `}</style>
    </form>
  )
}
