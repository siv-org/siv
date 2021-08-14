import { Section } from './Section'
import { SideBySide } from './SideBySide'

export const WhereAreWe = (): JSX.Element => (
  <Section>
    <SideBySide
      smallHeadline
      graphic="voting.jpg"
      headline="Unusual Times"
      headlineStyle={{ color: '#222' }}
      text="As states work to protect citizen health, we face unprecedented challenges with safe and reliable voting."
    />
    <SideBySide
      flipped
      smallHeadline
      graphic="voting-line-ridic.jpg"
      text="Too many voters are being asked to wait in long lines or share too few polling locations."
    />
  </Section>
)
