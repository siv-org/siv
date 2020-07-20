import { Button } from './Button'
import { Section } from './Section'
import { SideBySide } from './SideBySide'

export const ForGovernments = (): JSX.Element => (
  <Section>
    <SideBySide
      flipped
      graphic="make-us-think-again.jpg"
      headline="The US spends over $500M/yr to run elections"
      text="Digital approaches can dramatically reduce election costs and offer a far better process for everyone involved."
    />

    <Button
      href="mailto:contact@secureinternetvoting.org?subject=Schedule%20a%20Consultation&body=Hi%2C%20%0A%0AI%20work%20for%20a%20government%20and%20would%20like%20to%20find%20a%20time%20to%20talk%20about%20adopting%20Secure%20Internet%20Voting.%20"
      style={{ marginBottom: 30, marginLeft: '3%' }}
    >
      Schedule Consultation
    </Button>

    <SideBySide
      graphic="i-voted-on-phone.png"
      headline="A New Option"
      text="SIV is an addition to existing approaches, not a replacement. Any voter who prefers traditional methods can stick with them."
    />
  </Section>
)
