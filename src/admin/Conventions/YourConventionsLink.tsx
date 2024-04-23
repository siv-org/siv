import Link from 'next/link'

export const YourConventionsLink = () => {
  return (
    <Link href="/admin/conventions">
      <div className="pb-2 pl-2 pr-4 -ml-2 transition border-2 border-transparent border-solid rounded-lg cursor-pointer sm:pl-4 sm:-ml-4 hover:border-[#002868] mt-14">
        <h2>
          Your Conventions <BetaBadge />
        </h2>
        <p>
          Reusable voter credentials, for multiple ballots throughout a day.{' '}
          <a className="ml-3 opacity-70 hover:no-underline">Go {'→'}</a>
        </p>
      </div>
    </Link>
  )
}

const BetaBadge = () => (
  <span className="text-[11px] border-solid border border-[#002868]/70 relative bottom-[3px] text-[#002868]/90 font-bold p-1 rounded ml-1">
    Beta
  </span>
)
