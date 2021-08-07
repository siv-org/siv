import { OnClickButton } from 'src/landing-page/Button'

export const LoginInput = ({ mobile }: { mobile?: boolean }) => {
  return (
    <>
      <input placeholder="Login Email" />
      <OnClickButton
        invertColor={!mobile}
        style={{ margin: 0, padding: `${mobile ? 7 : 6}px 15px`, whiteSpace: 'nowrap' }}
        onClick={() => {}}
      >
        Send Code
      </OnClickButton>
      <style jsx>{`
        input {
          padding: 9px 15px;
          font-size: 16px;
          flex-grow: 1;
          border-radius: 4px;
          border: ${mobile ? '1px solid #ccc' : 0};
          outline-width: 0;
          width: 50px;
          margin-right: 10px;
        }
      `}</style>
    </>
  )
}
