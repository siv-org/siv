import { IfNoForm } from './IfNoForm'

export const NoContent = (): JSX.Element => {
  return (
    <>
      <p>
        Thank you for your answer!
        <br />
        <br />
        *All fields below are optional.
        <br />
        Your private information will never be sold.
      </p>
      <IfNoForm />
    </>
  )
}
