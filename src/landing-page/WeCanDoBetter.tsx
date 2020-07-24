import { JumboBlue } from './JumboBlue'

export const WeCanDoBetter = (): JSX.Element => (
  <JumboBlue>
    <h2>WE CAN DO BETTER</h2>
    <p>
      Despite vast demand, there&apos;s only modest discussion towards implementing <b>internet voting</b>. <br />
      Elections demand a high bar. The legitimacy of our citizen-led government is at stake.
    </p>

    <style jsx>{`
      h2 {
        margin: 0;
        width: 100%;
        padding-bottom: 30px;
      }

      p {
        font-size: calc(0.72vw + 1rem);
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      @media (min-width: 750px) {
        h2,
        p {
          text-align: center;
        }
      }
    `}</style>
  </JumboBlue>
)
