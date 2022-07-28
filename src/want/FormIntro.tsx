export const FormIntro = (): JSX.Element => {
  return (
    <>
      <h3>Thank you for your answer!</h3>
      <p>* All fields below are optional.</p>
      <h5>Your private information will never be sold.</h5>
      <style jsx>{`
        h3 {
          font-size: 20px;
          font-weight: 500;
        }

        h5 {
          opacity: 0.8;
          font-weight: normal;
        }
      `}</style>
    </>
  )
}
