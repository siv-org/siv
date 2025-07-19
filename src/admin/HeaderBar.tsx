import { UserOutlined } from '@ant-design/icons'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { api } from '../api-helper'
import logo from '../homepage/logo.png'
import { promptLogout, useUser } from './auth'
import { useDynamicHeaderbarHeight } from './useDynamicHeaderbarHeight'
import { revalidate, useStored } from './useStored'

const logoWidth = 45

export const HeaderBar = (): JSX.Element => {
  const { user } = useUser()
  const { election_id, election_title } = useStored()

  const headerId = useDynamicHeaderbarHeight(election_title)

  return (
    <div className="bg-gradient-to-r from-[#010b26] to-[#072054] text-white flex w-full justify-between" id={headerId}>
      {/* Logo */}
      <section className="min-w-[80px] py-4 sm:min-w-[281px]">
        <Link
          className="relative flex items-center p-1.5 ml-3 top-px active:opacity-60 hover:opacity-80"
          href={'/admin'}
          onClick={() => {
            const el = document.getElementById('main-content')
            if (el) el.scrollTop = 0
          }}
        >
          <Image
            alt="SIV"
            className="opacity-90 brightness-0 invert"
            height={(logoWidth * 219) / 482}
            src={logo}
            width={logoWidth}
          />
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
                <div
                  className="text-[14px] italic cursor-pointer hover:opacity-90"
                  onClick={async () => {
                    const new_title = prompt('Rename Election? Current: ' + election_title)
                    if (!new_title) return

                    try {
                      const response = await api(`election/${election_id}/admin/rename-election`, { new_title })

                      if (!response.ok) {
                        const error = await response.json()
                        alert('Failed to rename election: ' + (error.error || 'Unknown error'))
                        return
                      }

                      // Revalidate the data to show the new title
                      revalidate(election_id)
                    } catch (error) {
                      console.error('Error renaming election:', error)
                      alert('Failed to rename election. Please try again.')
                    }
                  }}
                >
                  {election_title}
                </div>
                <div className="text-[10px] opacity-80 relative top-0.5">ID: {election_id}</div>
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
