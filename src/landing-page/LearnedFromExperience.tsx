import { Section } from './Section'
import { SideBySide } from './SideBySide'

export const LearnedFromExperience = (): JSX.Element => (
  <Section>
    <SideBySide
      flipped
      graphic="david-at-wef.jpg"
      graphicCaption="David Ernst, SIV Founder, speaking @ World Economic Forum on Democracy"
      headline="Learned From Experience"
      text="For the last four years, we have been piloting digital democracy demos with thousands of citizens, from all different backgrounds, geographies, and world views."
    />
  </Section>
)
