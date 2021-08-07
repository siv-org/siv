import { TextField } from '@material-ui/core'
import { OnClickButton } from 'src/landing-page/Button'

export const LoginInput = ({ mobile }: { mobile?: boolean }) => {
  const Input = mobile ? MUIInput : PlainInput

  return (
    <>
      <Input />
      <OnClickButton
        invertColor={!mobile}
        style={{ margin: 0, padding: `${mobile ? 7 : 6}px 15px`, whiteSpace: 'nowrap' }}
        onClick={() => {}}
      >
        Send Code
      </OnClickButton>
    </>
  )
}

const PlainInput = () => (
  <>
    <input placeholder="Login Email" />
    <style jsx>{`
      input {
        padding: 9px 15px;
        font-size: 16px;
        flex-grow: 1;
        border-radius: 4px;
        border: 0;
        outline-width: 0;
        width: 50px;
        margin-right: 10px;
      }
    `}</style>
  </>
)

const MUIInput = () => (
  <TextField label="Login Email" size="small" style={{ backgroundColor: '#fff', marginRight: 10 }} variant="outlined" />
)
