import { Section } from '../landing-page/Section'
import { SideBySide } from '../landing-page/SideBySide'

export const AnotherOption = (): JSX.Element => (
  <Section>
    <SideBySide
      graphic="i-voted-on-phone.png"
      headline="Voters need another option"
      text="Give them the easiest method of voting ever made available."
    />
  </Section>
)
