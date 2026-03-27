import Link from 'next/link'

export function StartAVoteButton() {
  return (
    <Link
      className="group inline-flex items-center gap-2.5 rounded-full bg-h26-green px-10 py-4 text-[0.92rem] font-medium text-white no-underline shadow-h26-cta transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-h26-cta-hover"
      href="/login"
    >
      Start a Vote
      {/* right arrow icon */}
      <svg
        className="transition-transform duration-200 group-hover:translate-x-1"
        fill="none"
        height="16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
        width="16"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </Link>
  )
}
