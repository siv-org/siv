import Link from 'next/link'

export const HeaderBar = (): JSX.Element => (
  <div className="bg-[linear-gradient(90deg,#010b26_0%,#072054_100%)]">
    <div className="mx-auto flex w-full max-w-[750px] items-baseline p-4 max-[480px]:flex-col">
      <Link className="text-[24px] font-bold text-white hover:no-underline" href="/">
        SIV
      </Link>
      <Link className="ml-12 text-[16px] text-white max-[480px]:mt-2 max-[480px]:ml-0" href="/protocol">
        Protocol
      </Link>
    </div>
  </div>
)
