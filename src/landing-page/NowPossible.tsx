import { Section } from './Section'
import { SideBySide } from './SideBySide'

export const NowPossible = (): JSX.Element => (
  <Section>
    <SideBySide
      noDarkFilter
      button={{ href: '/protocol', text: 'SIV Protocol Details' }}
      graphic="hello-phone.png"
      headline={
        <>
          Fast, private, and <em>verifiable</em> internet voting is now possible.
        </>
      }
      text="Thanks to tremendous breakthroughs in technology & cryptography."
    />
    <SideBySide
      flipped
      graphic="david-at-wef.jpg"
      graphicCaption="David Ernst, SIV Founder, speaking @ World Economic Forum on Democracy"
      headline="Learned From Experience"
      text="For the last four years, we have been piloting digital democracy demos with thousands of citizens, from all different backgrounds, geographies, and world views."
    />
  </Section>
)
