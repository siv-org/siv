import { TextField, TextFieldProps } from '@mui/material'
import { useCallback, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { Row } from 'src/_shared/Forms/Row'
import { NoSsr } from 'src/_shared/NoSsr'
import { api } from 'src/api-helper'

const suggestedAmounts = { 10: '10', 1_000: '1k', 100_000: '100k', 1_000_000: '1m' }
const formName = 'investment'

export const InvestmentForm = () => {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [amountSelected, setAmountSelected] = useState(Object.keys(suggestedAmounts)[0])
  const [custom, setCustom] = useState('')

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
      <Row>
        <Field fullWidth id="email" label="Your Email" />
      </Row>
      <p style={{ fontWeight: '600', marginBottom: 0 }}>Preferred Investment Amount:</p>
      <Row style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: 0 }}>
        {Object.entries(suggestedAmounts).map(([amount, label], index) => (
          <label
            key={amount}
            style={{
              cursor: 'pointer',
              marginRight: 0,
              padding: 5,
              paddingLeft: index === 0 ? 0 : 5,
              textAlign: 'center',
            }}
          >
            <input
              checked={amount === amountSelected}
              name={`${formName}-amount-${amount}`}
              type="radio"
              value={amount}
              onChange={() => {
                setSaved(false)
                setAmountSelected(amount)
                setCustom('')
              }}
            />
            ${label}
          </label>
        ))}
        <Field
          id="custom-amount"
          label="Custom"
          style={{ marginLeft: 10, width: 100 }}
          value={custom}
          onChange={({ target }) => {
            setSaved(false)
            setAmountSelected(target.value)
            setCustom(target.value)
          }}
        />
      </Row>
      <p>
        <i>Payment options: Bank Transfer, Credit/Debit Card, Cryptocurrency, Paypal</i>
      </p>
      <Row style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
        {saved && <p style={{ margin: 0, opacity: 0.7, width: 60 }}>Done.</p>}
        <OnClickButton
          disabled={saved}
          style={{ marginRight: 0 }}
          onClick={async () => {
            const fields: Record<string, string> = {}
            setError('')

            // Get data from input fields
            ;['name', 'email'].forEach((field) => {
              fields[field] = (document.getElementById(`${formName}-${field}`) as HTMLInputElement).value
            })
            fields['amount'] = amountSelected

            const response = await api('citizen-forms/investment', fields)
            if (response.ok) return setSaved(true)

            setError((await response.json()).error)
          }}
        >
          Next
        </OnClickButton>
      </Row>
      <p className="error">{error}</p>

      <style jsx>{`
        .error {
          color: red;
          position: relative;
          bottom: 6rem;
        }
      `}</style>
    </form>
  )
}
