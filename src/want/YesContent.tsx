import { IfYesForm } from './IfYesForm'

export const YesContent = (): JSX.Element => {
  return (
    <>
      <p>
        *All fields are optional. Answers very much appreciated!
        <br />
        Your private information will never be sold.
      </p>
      <IfYesForm />
    </>
  )
}
