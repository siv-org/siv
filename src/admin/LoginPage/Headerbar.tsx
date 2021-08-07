import { TextField } from '@material-ui/core'
import { OnClickButton } from 'src/landing-page/Button'

export const Headerbar = () => {
  return (
    <header>
      <h2>Secure Internet Voting</h2>
      <section>
        <TextField fullWidth label="Login Email" size="small" style={{ background: 'white' }} variant="outlined" />
        <OnClickButton
          invertColor
          style={{ marginRight: 0, padding: '5px 15px', whiteSpace: 'nowrap' }}
          onClick={() => {}}
        >
          Send Code
        </OnClickButton>
      </section>
      <style jsx>{`
        header {
          background: rgb(1, 5, 11);
          background: linear-gradient(90deg, #010b26 0%, #072054 100%);

          color: #fff;
          display: flex;
          width: 100%;
          justify-content: space-between;

          padding: 0 15vw;

          z-index: 100;
          position: relative;
        }

        section {
          display: flex;
          align-items: center;
        }
      `}</style>
    </header>
  )
}
