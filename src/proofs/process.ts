// export type ReactLine = { react: () => JSX.Element }
// export type Line = Record<string, string> | ReactLine | '' | string

export const process = [
  {
    html: `This page lays out how anyone can confirm the complete accuracy of this <a href="https://secureinternetvoting.org" target="_blank">SecureInternetVoting.org</a> Election.`,
  },
  { section: 'Work backwards from Vote Totals' },
  { step: 'Vote totals are the sums of each unique option from the Decrypted Votes table.' },
  "These sums are being automatically recounted in every visitor's browser.",
  'Anyone can verify these numbers themselves by hand or with a simple spreadsheet.',
  { step: 'Combine the tracking number and each vote column like this: [tracking]:[vote].' },
  { step: 'Encode the alphanumeric votes into an integer.' },
  {
    step: 'The decrypted votes are the Lagrangian Interpolations of the Partial Decryptions provided by the Trustees.',
  },
  { todo: 'Show Partial Decryption data' },
  { todo: 'Needs to provide code to implement the Lagrangian Interpolation formula.' },
]
