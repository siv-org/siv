import { OnClickButton } from 'src/landing-page/Button'

export const Headerbar = () => {
  return (
    <header>
      <div>
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
      </div>
      <style jsx>{`
        header {
          background: rgb(1, 5, 11);
          background: linear-gradient(90deg, #010b26 0%, #072054 100%);

          color: #fff;
          width: 100%;

          padding: 0 3vw;

          z-index: 100;
          position: relative;

          display: flex;
          justify-content: center;
        }

        div {
          display: flex;
          justify-content: space-between;
          flex: 1;
          max-width: 1000px;
        }

        h2 {
          white-space: nowrap;
          margin-right: 2rem;
        }

        section {
          display: flex;
          align-items: center;
          max-width: 410px;
          flex: 1;
        }

        input {
          padding: 9px 15px;
          font-size: 16px;
          flex-grow: 1;
          border-radius: 4px;
          border: 0;
          outline-width: 0;
          width: 50px;
        }
      `}</style>
    </header>
  )
}
