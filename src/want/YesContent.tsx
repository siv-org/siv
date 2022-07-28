import { IfYesForm } from './IfYesForm'

export const YesContent = ({ id }: { id?: string }): JSX.Element => {
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
      <IfYesForm id={id} />
    </>
  )
}
