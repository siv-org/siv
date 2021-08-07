import { OnClickButton } from 'src/landing-page/Button'

export const Headerbar = () => {
  return (
    <header>
      <h2>Secure Internet Voting</h2>
      <section>
        <input placeholder="Login Email" />
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

        input {
          padding: 9px 15px;
          font-size: 16px;
          width: 283px;
          border-radius: 4px;
          border: 0;
          outline-width: 0;
        }
      `}</style>
    </header>
  )
}
