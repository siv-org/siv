import { Button } from './Button'

const darkBlue = '#002868'

export const SIVFeatures = (): JSX.Element => (
  <div style={{ padding: '6.6vmax 17px', textAlign: 'center' }}>
    <h2>Secure Internet Voting</h2>
    <Feature
      headline="Easy to use"
      text="You can vote from your phone. It takes one minute. You don’t have to install anything."
    />
    <Feature headline="Private" text="No one, not even election administrators, can see how you voted." />
    <Feature headline="Verifiable" text="You can personally verify that your vote counted." />
    <Feature headline="Widely Accessible" text="Works with any smartphone or desktop." />
    <Feature headline="Auditable registration" text="Only legitimate voters can vote, and only once." />
    <Feature
      headline="Quick results"
      text="Don’t wait on postal mail delays. SIV ballots can be submitted and tallied in seconds."
    />

    <br />
    <br />
    <Button href="/#protocol">Study SIV Protocol</Button>

    <style jsx>{`
      h2 {
        text-align: center;
        color: ${darkBlue};
      }
    `}</style>
  </div>
)

const Feature = ({ headline, text }: { headline: string | JSX.Element; text: string }) => (
  <div className="container">
    <h4>{headline}</h4>
    <p>{text}</p>

    <style jsx>{`
      .container {
        padding: 17px;
      }

      h4 {
        margin-top: 0;
        color: ${darkBlue};
      }

      h4,
      p {
        text-align: center;
      }
    `}</style>
  </div>
)
