import { Section } from './Section'
import { SideBySide } from './SideBySide'

export const WhereAreWe = (): JSX.Element => (
  <Section>
    <SideBySide
      smallHeadline
      graphic="voting.jpg"
      headline="Unusual Times"
      text="As states work to protect citizen health, we face unprecedented challenges with safe and reliable voting."
    />
    <SideBySide
      flipped
      smallHeadline
      graphic="voting-line-ridic.jpg"
      text="Six hour waiting lines in Georgia. 600,000 voters forced to share a single polling location in Kentucky. Tens of thousands of polling centers closed throughout the country."
    />
  </Section>
)
