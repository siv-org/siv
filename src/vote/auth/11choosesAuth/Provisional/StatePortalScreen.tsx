import { TextField } from '@mui/material'

export const StatePortalScreen = () => {
  return (
    <div className="mx-auto max-w-96">
      <h1 className="mt-8 text-3xl font-bold">Confirm Voter Eligibility</h1>

      <p className="text-lg font-medium opacity-50">Step 1 of 2</p>

      <p className="mt-10 text-xl">
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

      <p className="mt-6 opacity-70">This info must match exactly.</p>

      <div className="text-left">
        <p className="mt-6 text-xl">First name:</p>
        <TextField autoFocus className="w-full min-h-20" />

        <p className="text-xl">Last name:</p>
        <TextField autoFocus className="w-full min-h-20" />

        <p className="text-xl">Date of birth (MM-DD-YYYY):</p>
        <TextField autoFocus className="w-full min-h-20" />
      </div>
    </div>
  )
}
