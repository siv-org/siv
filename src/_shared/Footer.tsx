import Link from 'next/link'

import { EmailSignup } from '../homepage3/EmailSignup'

const email = 'questions@siv.org'

export const Footer = (): JSX.Element => {
  return (
    <div className="columns">
      <div className="column">
        <EmailSignup />
      </div>
      <div className="column text-align-right">
        <h3>SIV</h3>
        <p>
          <Link href="/about">
            <a className="styled-link">Research</a>
          </Link>
          <br />
          <Link href="/protocol">
            <a className="styled-link">Protocol</a>
          </Link>
          <br />
          <Link href="/faq">
            <a className="styled-link">Frequently Asked Questions</a>
          </Link>
        </p>
        <p>
          <a href={`mailto:${email}`}>
            <img id="mail-icon" src="/protocol/step-1-invitation-icon.png" width="17px" />
            {email}
          </a>
        </p>
      </div>
      <style jsx>{`
        .columns {
          padding: 3rem;
          display: flex;
          justify-content: space-between;
        }

        .column:first-child {
          margin-right: 15%;
        }

        .text-align-right {
          text-align: right;
        }

        a {
          color: #000;
        }

        a.styled-link {
          text-decoration: none;
          font-weight: bold;
        }

        a.styled-link:hover {
          text-decoration: underline;
        }

        #mail-icon {
          margin-right: 7px;
        }

        /* Small screens: reduce horiz padding */
        @media (max-width: 750px) {
          .columns {
            padding: 17px 6vw;
            flex-direction: column;
          }

          .column:first-child {
            margin: 0;
            margin-bottom: 3rem;
          }

          .text-align-right {
            text-align: left;
          }
        }

        /* Large screens: increase horiz padding */
        @media (min-width: 1050px) {
          .columns {
            padding: 17px 5rem;
          }
        }
      `}</style>
    </div>
  )
}
