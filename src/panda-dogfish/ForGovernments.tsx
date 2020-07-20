import { Section } from './Section'
import { SideBySide } from './SideBySide'

export const consultation_link = 'mailto:contact@secureinternetvoting.org?subject=Schedule Consultation&body=Hi, \n\nI work for a government and would like to find a time to talk about adopting Secure Internet Voting.'
  .replace(/ /g, '%20')
  .replace(/\n/g, '%0A')
  .replace(/,/g, '%2C')

export const ForGovernments = (): JSX.Element => (
  <Section>
    <SideBySide
      flipped
      button={{ href: consultation_link, text: 'Schedule Consultation' }}
      graphic="voting-machines.jpg"
      headline="The US spends over $500M/yr to run elections"
      text="SIV can dramatically reduce election costs, while offering a far better process for everyone involved."
    />

    <SideBySide
      graphic="i-voted-on-phone.png"
      headline="A New Option"
      text="SIV is an addition to existing approaches, not a replacement. Any voter who prefers traditional methods can stick with them."
    />
  </Section>
)
