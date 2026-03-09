import { ScrollReveal } from './ScrollReveal'
import { StartAVoteButton } from './StartAVoteButton'

export function ClosingCta() {
  return (
    <section className="px-7 py-16 text-center md:py-24">
      <ScrollReveal className="mx-auto max-w-[600px]">
        <h2 className="font-serif2026 text-[clamp(1.6rem,3.8vw,2.6rem)] font-normal tracking-tight">
          Ready to modernize your elections?
        </h2>
        <p className="mx-auto mt-4 max-w-[440px] text-[0.92rem] md:text-[1rem] leading-[1.7] text-h2026-textSecondary">
          SIV works alongside existing voting methods. Start with a pilot, or run a full election — at any scale.
        </p>
        <div className="mt-8">
          <StartAVoteButton />
        </div>
      </ScrollReveal>
    </section>
  )
}
