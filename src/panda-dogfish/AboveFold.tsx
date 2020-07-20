import { Button } from './Button'
import { JumboBlue } from './JumboBlue'

export const AboveFold = (): JSX.Element => (
  <JumboBlue>
    <h1 style={{ margin: '6rem 0 0', padding: 17, textAlign: 'center' }}>Fast. Private. Verifiable</h1>
    <Button invertColor href="mailto:contact@secureinternetvoting.org">
      Contact Us
    </Button>
  </JumboBlue>
)
