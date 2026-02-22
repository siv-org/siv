const NEWS_ITEMS: { title: string; description: string; href: string }[] = [
  {
    title: 'The largest digital vote in US history',
    description: 'Deployed at scale, verified end-to-end.',
    href: '#',
  },
  {
    title: 'Anti-coercion solution, deployed',
    description: 'Protecting voters from influence & intimidation.',
    href: '#',
  },
  {
    title: 'DEF CON Red-Team Hack SIV Challenge: Results',
    description: "The world's top hackers took their best shot.",
    href: '#',
  },
]

export function NewsSection() {
  return (
    <section className="px-7 py-10 md:py-[60px]" id="news">
      <div className="mx-auto max-w-[1060px]">
        <p className="font-mono2026 mb-5 text-[0.68rem] uppercase tracking-[0.15em] text-h2026-muted">
          Latest
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {NEWS_ITEMS.map((item) => (
            <a
              key={item.title}
              className="group relative flex flex-col gap-2 rounded-h2026 border border-h2026-border bg-h2026-bgCard p-5 no-underline text-inherit transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-h2026-borderStrong hover:shadow-h2026-md md:px-6 md:py-6 after:absolute after:right-5 after:top-[22px] after:-translate-x-1.5 after:text-[0.9rem] after:text-h2026-muted after:opacity-0 after:transition-all after:content-['→'] group-hover:after:translate-x-0 group-hover:after:opacity-100 after:md:right-6"
              href={item.href}
            >
              <h3 className="pr-5 text-[0.92rem] font-medium leading-snug md:pr-6">{item.title}</h3>
              <p className="text-[0.78rem] leading-[1.5] text-h2026-muted">{item.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
