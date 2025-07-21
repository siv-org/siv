import Link from 'next/link'

export const HeaderBar = (): JSX.Element => (
  <div className="p-4 bg-gradient-to-r from-[#010b26] to-[#072054]">
    <div className="max-w-[750px] mx-auto">
      <Link className="text-[24px] font-bold hover:no-underline text-white" href="/">
        Secure Internet Voting
      </Link>
    </div>
  </div>
)
