import { ScrollReveal } from './ScrollReveal'
import { StartAVoteButton } from './StartAVoteButton'

export function ClosingCta() {
  return (
    <section className="px-7 py-16 text-center md:py-24 mx-auto max-w-[600px]">
      <ScrollReveal>
        <h2 className="font-serif26 text-[clamp(1.5rem,3.5vw,2.2rem)] tracking-tight">
          Ready to modernize your elections?
        </h2>

        <p className="mx-auto mt-4 mb-8 max-w-[440px] text-[0.92rem] leading-[1.7] text-h26-textSecondary">
          SIV works alongside existing voting methods. Start with a pilot, or run a full election — at any scale.
        </p>

        <StartAVoteButton />
      </ScrollReveal>
    </section>
  )
}
