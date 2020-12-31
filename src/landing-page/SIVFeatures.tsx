import { Button } from './Button'
import { Section } from './Section'

const darkBlue = '#002868'

export const SIVFeatures = (): JSX.Element => (
  <Section>
    <h4>Introducing</h4>
    <h2>Secure Internet Voting</h2>
    <Row>
      <Feature
        headline="Easy to use"
        text="You can vote from your phone in a minute, without needing to install anything."
      />
      <Feature headline="Provably Private" text="No one, not even election administrators, can see how you voted." />
      <Feature headline="Verifiable" text="You can personally verify that your vote was counted correctly." />
    </Row>
    <Row>
      <Feature headline="Widely accessible" text="Works with any smartphone or desktop." />
      <Feature headline="Auditable registration" text="Only legitimate voters can vote, and only once." />
      <Feature
        headline="Quick results"
        text="Don’t wait on postal mail delays. SIV ballots can be submitted in seconds."
      />
    </Row>
    <div className="center-button">
      <Button href="/protocol">SIV Protocol Details</Button>
    </div>

    <style jsx>{`
      h2 {
        color: ${darkBlue};
        margin-bottom: 4rem;
      }

      h4,
      h2,
      .center-button {
        text-align: center;
      }

      .center-button {
        margin-bottom: 30px;
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
        margin-bottom: 90px;
      }

      @media (max-width: 620px) {
        div {
          flex-direction: column;
          margin-bottom: 0;
        }
      }
    `}</style>
  </div>
)
