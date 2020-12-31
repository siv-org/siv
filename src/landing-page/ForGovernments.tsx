import { Section } from './Section'
import { SideBySide } from './SideBySide'

export const ForGovernments = (): JSX.Element => (
  <Section>
    <SideBySide
      flipped
      button={{ href: '/for-governments#give-your-voters', text: 'Schedule Consultation' }}
      graphic="voting-machines.jpg"
      headline="The US spends over $500M/year to run elections"
      text="SIV can dramatically reduce election administration costs, while offering a far better process for everyone involved."
    />

    <SideBySide
      graphic="i-voted-on-phone.png"
      headline="A New Option"
      text="SIV is an addition to existing approaches, not a replacement. Any voter who prefers traditional methods can still use them."
    />
  </Section>
)
