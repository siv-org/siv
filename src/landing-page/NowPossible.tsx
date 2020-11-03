import { Section } from './Section'
import { SideBySide } from './SideBySide'

export const NowPossible = (): JSX.Element => (
  <Section>
    <SideBySide
      noDarkFilter
      graphic="hello-phone-2.png"
      headline={
        <>
          Fast, private, and <em>verifiable</em> internet voting is now possible.
        </>
      }
      text="Thanks to tremendous breakthroughs in technology & cryptography."
    />
  </Section>
)
