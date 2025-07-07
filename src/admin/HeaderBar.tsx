import { UserOutlined } from '@ant-design/icons'
import Head from 'next/head'
import Link from 'next/link'

import { promptLogout, useUser } from './auth'
import { useDynamicHeaderbarHeight } from './useDynamicHeaderbarHeight'
import { useStored } from './useStored'

export const HeaderBar = (): JSX.Element => {
  const { user } = useUser()
  const { election_id, election_title } = useStored()

  const headerId = useDynamicHeaderbarHeight(election_title)

  return (
    <div className="bg-gradient-to-r from-[#010b26] to-[#072054] text-white flex w-full justify-between" id={headerId}>
      {/* Logo */}
      <section className="min-w-[75px] py-4 sm:min-w-[281px]">
        <Link href={'/admin'}>
          <a
            className="font-bold text-[#ddd] px-4 hover:text-white hover:no-underline text-[24px]"
            onClick={() => {
              const el = document.getElementById('main-content')
              if (el) el.scrollTop = 0
            }}
          >
            SIV
          </a>
        </Link>
      </section>

      <section className="flex justify-between py-4 w-full sm:relative sm:right-8">
        <div className="flex">
          {election_id && (
            <>
              <Head>
                <title key="title">SIV: Manage {election_title}</title>
              </Head>

              {/* Election title */}
              <div className="relative bottom-0.5">
                <div className="text-[14px] italic">{election_title}</div>
                <div className="text-[10px] opacity-80 relative top-1">ID: {election_id}</div>
              </div>
            </>
          )}
        </div>

        {/* Login status */}
        <div
          className="text-base py-[3px] px-2.5 rounded-md items-center mr-4 cursor-pointer hover:bg-white/20 sm:flex hidden whitespace-nowrap"
          onClick={promptLogout}
        >
          <UserOutlined />
          &nbsp; {user.name}
        </div>
      </section>
    </div>
  )
}
