import { EmailSignup } from '../landing-page/EmailSignup'

const email = 'questions@secureinternetvoting.org'

export const Footer = (): JSX.Element => (
  <footer>
    <div>
      <EmailSignup />
    </div>
    <div className="text-align-right">
      <h3>SIV</h3>
      <p>&ldquo;SIV&rdquo;, like civilization</p>
      <p>
        <a href={`mailto:${email}`}>{email}</a>
      </p>
    </div>
    <style jsx>{`
      footer {
        padding: 3rem 0;
        display: flex;
        justify-content: space-between;
      }

      div:first-child {
        margin-right: 15%;
      }

      h3 {
        font-size: 2.5vw;
      }

      p {
        font-size: 1.625vw;
      }

      .text-align-right {
        text-align: right;
      }

      a {
        color: #000;
        font-weight: bold;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      /* Small screens: reduce horiz padding */
      @media (max-width: 750px) {
        footer {
          padding: 17px 6vw;
          flex-direction: column;
        }

        div:first-child {
          margin: 0;
          margin-bottom: 3rem;
        }

        .text-align-right {
          text-align: left;
        }
      }

      /* Large screens: increase horiz padding */
      @media (min-width: 1050px) {
        footer {
          padding: 17px 5rem;
        }
      }
    `}</style>
  </footer>
)
