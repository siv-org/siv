import { TextField } from '@mui/material'
import { useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'

const fields = ['First Name', 'Last Name', 'Date of Birth (MM-DD-YYYY)', 'Street Address', 'City', 'Zip']

export const VoterRegistrationLookupScreen = () => {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})

  function setFieldValue(label: string, value: string) {
    setFieldValues({ ...fieldValues, [label]: value })
  }

  return (
    <div className="mx-auto max-w-96">
      <p className="mt-8 text-lg font-medium opacity-50">Step 1 of 2</p>
      <h1 className="mt-1 text-3xl font-bold">Voter Registration Lookup</h1>

      <p className="mt-8 text-xl">
        We need to confirm you are a voter on the official{' '}
        <a
          className="font-semibold text-blue-500 hover:underline"
          href="https://votesearch.utah.gov/voter-search/search/search-by-voter/voter-info"
          rel="noreferrer noopener"
          target="_blank"
        >
          State Voter Roll
        </a>
        .
      </p>

      <div className="flex flex-col gap-8 mt-8 text-left">
        {fields.map((label) => (
          <Field key={label} {...{ label, setFieldValue, value: fieldValues[label] }} />
        ))}
      </div>

      <OnClickButton
        className="!mt-10 w-full text-xl text-center max-w-80"
        onClick={() => {
          alert(JSON.stringify(fieldValues))
        }}
      >
        Submit
      </OnClickButton>
    </div>
  )
}

function Field({
  label,
  setFieldValue,
  value,
}: {
  label: string
  setFieldValue: (label: string, value: string) => void
  value: string
}) {
  return (
    <div>
      <p className="text-xl">{label}</p>
      <TextField
        className="w-full"
        InputProps={{ style: { fontSize: 22 } }}
        onChange={(e) => setFieldValue(label, e.target.value)}
        {...{ value }}
      />
    </div>
  )
}
