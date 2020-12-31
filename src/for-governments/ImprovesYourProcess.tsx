import { Section } from '../landing-page/Section'

const darkBlue = '#002868'

export const ImprovesYourProcess = (): JSX.Element => (
  <Section>
    <h3>SIV</h3>
    <h3>conforms with and improves your election process</h3>
    <Row>
      <Feature
        headline="Quicker Results"
        text="Ballots can be submitted at the speed of light, with near instant confirmation for the voter. Once the election closes, SIV can tally millions of ballots in seconds."
      />
      <Feature
        headline="Auditable Verification"
        text="Easily verify each vote was from a registered voter, not tampered with, and counted correctly."
      />
      <Feature
        headline="Budget Savings"
        text="Lower administrative costs for personnel, polling place locations, ballot printing, mail-voting processing, and more."
      />
    </Row>

    <style jsx>{`
      h3 {
        margin: 0rem;
      }

      h4,
      h3 {
        text-align: center;
      }

      @media (max-width: 620px) {
        h4,
        h2 {
          text-align: left;
        }
      }
    `}</style>
  </Section>
)

const Feature = ({ headline, text }: { headline: string | JSX.Element; text: string }) => (
  <div className="container">
    <h4>{headline}</h4>
    <p>{text}</p>

    <style jsx>{`
      .container {
        padding: 17px;
        flex: 1;
        text-align: center;
      }

      h4 {
        margin-top: 0;
        color: ${darkBlue};
      }

      /* Ensure headlines stay on one line */
      @media (max-width: 776px) and (min-width: 620px) {
        h4 {
          font-size: calc(1.4vw + 0.4rem);
        }
      }

      @media (max-width: 620px) {
        .container {
          text-align: left;
          padding: 17px 0;
        }
      }
    `}</style>
  </div>
)

const Row = ({ children }: { children: JSX.Element[] }) => (
  <div>
    {children}

    <style jsx>{`
      div {
        display: flex;
        margin: 90px 0;
      }

      @media (max-width: 620px) {
        div {
          flex-direction: column;
          margin-bottom: 0;
          margin-top: 30px;
        }
      }
    `}</style>
  </div>
)
