import { Button } from '../landing-page/Button'

export const TransparentProtocol = (): JSX.Element => (
  <div>
    <h2>
      SIV&apos;s transparent protocol helps you give citizens the option to vote with far stronger <i>security</i> &amp;{' '}
      <i>privacy</i> than paper methods.
    </h2>
    <Button href="/protocol">See an interactive explanation of how SIV works</Button>

    <style jsx>{`
      div {
        padding: 30px 30px 60px;
        text-align: center;
        max-width: 1240px;
        margin: 0 auto;
      }
    `}</style>
  </div>
)
