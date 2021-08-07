import { darkBlue } from 'src/landing-page/Button'

export const AboutSection = () => {
  return (
    <aside>
      <img className="logo" src="/login/circle-logo.png" />
      <h3>
        Fast, private, & verifiable <br />
        elections.
      </h3>
      <img className="phone" src="/login/iphone.png" />
      <style jsx>{`
        img.logo {
          display: block;
          width: 70px;
        }

        h3 {
          font-size: 28px;
          color: ${darkBlue};
        }

        img.phone {
          display: block;
          width: 200px;
          position: relative;
          right: 10px;
        }
      `}</style>
    </aside>
  )
}
