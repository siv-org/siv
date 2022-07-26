import { IfNoForm } from './IfNoForm'

export const NoContent = (): JSX.Element => {
  return (
    <>
      <p>
        *All fields are optional. Answers very much appreciated!
        <br />
        Your private information will never be sold.
      </p>
      <IfNoForm />
    </>
  )
}
