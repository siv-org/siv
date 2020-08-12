import { OnClickButton } from '../landing-page/Button'

export const SubmitButton = () => {
  return (
    <div>
      <OnClickButton onClick={() => console.log('Press Me')}>Submit</OnClickButton>
      <style jsx>{`
        div {
          text-align: right;
        }
      `}</style>
    </div>
  )
}
