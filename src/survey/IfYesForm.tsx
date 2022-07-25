import { BoxProps, NoSsr, TextField, TextFieldProps } from '@material-ui/core'
import { useCallback, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { api } from 'src/api-helper'

export const IfYesForm = () => {
  const [saved, setSaved] = useState(false)
  const [showBottom, setShowBottom] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const formName = 'ifyesform'

  // DRY-up TextField
  const Field = useCallback(
    (props: TextFieldProps) => (
      <NoSsr>
        <TextField
          size="small"
          variant="outlined"
          onChange={() => setSaved(false)}
          {...props}
          id={`${formName}-${props.id}`}
          style={{ ...props.style }}
        />
      </NoSsr>
    ),
    [],
  )

  return (
    <form autoComplete="off">
      <Row>
        <Field fullWidth id="name" label="Your Name" />
      </Row>
      <Row style={{ marginBottom: 0 }}>
        <Field fullWidth id="email" label="Your Email" />
      </Row>
      <Row style={{ marginTop: 10 }}>
        <label onClick={() => void 0}>
          <input type="checkbox" />
          Keep me updated
        </label>
      </Row>
      <Row>
        <Field fullWidth id="city" label="City" style={{ marginRight: 30 }} />

        <Field fullWidth id="state" label="State" style={{ marginRight: 30 }} />

        <Field fullWidth id="country" label="Country" style={{ marginRight: 30 }} />

        <Field fullWidth id="zip" label="ZIP" style={{ maxWidth: 80 }} />
      </Row>
      <Row>
        <Field fullWidth multiline id="reson" label="Reason / Note" rows={4} />
      </Row>
      <Row style={{ marginBottom: 0 }}>
        <Field
          fullWidth
          multiline
          id="topics"
          label="Questions or topics you'd like more information about "
          rows={4}
        />
      </Row>
      <div className="content-preference">
        Preference:
        {['Video', 'Audio', 'Text'].map((label) => (
          <label key={label}>
            <input
              checked={selected[label]}
              type="checkbox"
              onClick={() => setSelected({ ...selected, [label]: !selected[label] })}
            />
            {label}
          </label>
        ))}
      </div>

      <OnClickButton
        style={{ marginLeft: 0 }}
        onClick={() => {
          setShowBottom(true)
        }}
      >
        Skip
      </OnClickButton>

      <OnClickButton
        onClick={() => {
          setShowBottom(true)
        }}
      >
        Submit
      </OnClickButton>

      {/* Bottom part */}
      {showBottom && <div className="bottom-part">bottom</div>}

      <style jsx>{`
        .error {
          color: red;
          position: relative;
          bottom: 6rem;
        }
        .content-preference {
          display: flex;
          margin-top: 10px;
        }

        .content-preference label {
          display: flex;
          font-size: 15px;
          align-items: center;
          margin-left: 1.5rem;
        }

        input[type='checkbox'] {
          margin-right: 15px;
          transform: scale(1.2);
        }
      `}</style>
    </form>
  )
}

const Row = (props: BoxProps) => (
  <div
    {...props}
    style={{
      display: 'flex',
      margin: '1.5rem 0',
      ...props.style,
    }}
  />
)
