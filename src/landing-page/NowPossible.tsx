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
  </Section>
)
