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
      text="Six hour waiting lines in Georgia. 600,000 Kentucky voters forced to share a single polling location. Tens of thousands of polling centers closed throughout the country."
    />
  </Section>
)
