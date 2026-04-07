import { ApartmentOutlined, LinkOutlined, QuestionCircleOutlined, SnippetsOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { promptLogout } from './auth'
import { useStored } from './useStored'

export const Sidebar = () => (
  <div className="hidden sm:block" style={{ height: 'calc(100vh - 66px)' }}>
    <SidebarContent />
  </div>
)

export const steps = ['Ballot Design', 'Privacy', 'Voters', 'Homepage']

const linkClasses =
  'my-1 block cursor-pointer rounded-[5px] py-[3px] px-2 text-[16px] font-medium text-[#000c] transition-colors duration-50 ease-linear hover:bg-[#ffffff58] hover:text-black hover:no-underline'

export const SidebarContent = ({ closeMenu = () => {} }: { closeMenu?: () => void }) => {
  const { election_id, section } = useRouter().query
  const { ballot_design_finalized, threshold_public_key } = useStored()

  const completed: Record<(typeof steps)[number], boolean> = {
    'Ballot Design': !!ballot_design_finalized,
    Homepage: true,
    Privacy: !!threshold_public_key,
    Voters: true,
  }
  const urled = (s: string) => s.toLowerCase().replaceAll(' ', '-')

  return (
    <div className="flex h-full w-[215px] flex-col justify-between overflow-y-auto bg-[#eee] pl-2 pr-[13px]">
      <main>
        <Link
          className={`${linkClasses} hover:!bg-white/0 !p-0`}
          href="/admin"
          onClick={() => {
            closeMenu()
            const el = document.getElementById('main-content')
            if (el) el.scrollTop = 0
          }}
        >
          <h2 className="my-4 mx-2 text-2xl font-bold text-[#010b26] sm:hidden">SIV</h2>
        </Link>

        {election_id && (
          <>
            {/* Election Management section */}
            <>
              <Label>
                <ApartmentOutlined style={{ marginRight: 5 }} /> Election Management
              </Label>

              {steps.map((name) => (
                <Link
                  className={`${linkClasses} ${urled(name) === section ? '!bg-white' : ''}`}
                  href={`/admin/${election_id}/${urled(name)}`}
                  key={name}
                  onClick={closeMenu}
                >
                  {name !== 'Voters' && name !== 'Homepage' && (
                    <input checked={completed[name]} className="relative bottom-0.5 mr-2" readOnly type="checkbox" />
                  )}
                  {name}
                </Link>
              ))}
            </>

            {/* Post Election section */}
            <>
              <Label>
                <SnippetsOutlined style={{ marginRight: 5 }} />
                Post Election
              </Label>

              <Link
                className={`${linkClasses} ${'marked-ballots' === section ? '!bg-white' : ''}`}
                href={`/admin/${election_id}/marked-ballots`}
                onClick={closeMenu}
              >
                Marked Ballots
              </Link>
            </>

            {/* Public pages section */}
            <>
              <Label>
                <LinkOutlined style={{ marginRight: 5 }} />
                Public Pages
              </Label>

              <Link className={linkClasses} href={`/election/${election_id}/vote`} target="_blank">
                Cast Vote
              </Link>
              <Link className={linkClasses} href={`/election/${election_id}`} target="_blank">
                Election Results
              </Link>
            </>
          </>
        )}
      </main>

      <div className="pb-4">
        <Label>
          <QuestionCircleOutlined style={{ marginRight: 5 }} />
          Support
        </Label>

        <Link className={linkClasses} href="/protocol" target="_blank">
          Protocol Overview
        </Link>
        <Link className={linkClasses} href="mailto:help@siv.org">
          Get Help
        </Link>

        <a className={`opacity-70 ${linkClasses}`} onClick={promptLogout}>
          Logout
        </a>
      </div>
    </div>
  )
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block pl-2 mt-[30px] opacity-50">{children}</label>
)
