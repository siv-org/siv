import { Button } from './Button'
import { JumboBlue } from './JumboBlue'

export const AboveFold = ({ height }: { height?: number }): JSX.Element => (
  <JumboBlue height={height}>
    <h1 style={{ margin: '4rem 0 0', padding: 17, textAlign: 'center' }}>Fast. Private. Verifiable</h1>
    <Button invertColor href="/protocol">
      SIV Protocol Details
    </Button>
  </JumboBlue>
)
