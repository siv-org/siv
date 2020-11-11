import { Button } from '../landing-page/Button'

export const TransparentProtocol = (): JSX.Element => (
  <div>
    <h2>SIV&apos;s transparent protocol lets you guarantee all votes are 100% private and secure.</h2>
    <Button href="/protocol">See an interactive explanation of how this works</Button>

    <style jsx>{`
      div {
        padding: 30px;
        text-align: center;
      }
    `}</style>
  </div>
)
