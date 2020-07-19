import { Button } from './Button'
import { JumboBlue } from './JumboBlue'

export const AboveFold = (): JSX.Element => (
  <JumboBlue>
    <h1 style={{ margin: 0, padding: 17 }}>Fast. Private. Verifiable</h1>
    <Button href="mailto:contact@secureinternetvoting.org" invertColor>
      Contact Us
    </Button>
  </JumboBlue>
)
