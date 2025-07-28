import { ApartmentOutlined, LinkOutlined, QuestionCircleOutlined, SnippetsOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useStored } from './useStored'

export const Sidebar = () => (
  <div className="hidden sm:block" style={{ height: 'calc(100vh - 66px)' }}>
    <SidebarContent />
  </div>
)

export const steps = ['Ballot Design', 'Privacy', 'Voters']

export const SidebarContent = ({ closeMenu = () => {} }: { closeMenu?: () => void }) => {
  const { election_id, section } = useRouter().query
  const { ballot_design_finalized, threshold_public_key } = useStored()

  const completed: Record<(typeof steps)[number], boolean> = {
    'Ballot Design': !!ballot_design_finalized,
    Privacy: !!threshold_public_key,
    Voters: true,
  }
  const urled = (s: string) => s.toLowerCase().replaceAll(' ', '-')

  return (
    <div className="sidebar">
      <main>
        <Link
          className="hover:!bg-white/0 !p-0"
          href="/admin"
          onClick={() => {
            closeMenu()
            const el = document.getElementById('main-content')
            if (el) el.scrollTop = 0
          }}
        >
          <h2 className="logo sm:hidden">SIV</h2>
        </Link>

        {election_id && (
          <>
            {/* Election Management section */}
            <>
              <label>
                <ApartmentOutlined style={{ marginRight: 5 }} /> Election Management
              </label>
              {steps.map((name) => (
                <Link href={`/admin/${election_id}/${urled(name)}`} key={name} legacyBehavior>
                  <a className={urled(name) === section ? 'current' : ''} onClick={closeMenu}>
                    {name !== 'Voters' && <input checked={completed[name]} readOnly type="checkbox" />}
                    {name}
                  </a>
                </Link>
              ))}
            </>

            {/* Post Election section */}
            <>
              <label>
                <SnippetsOutlined style={{ marginRight: 5 }} />
                Post Election
              </label>
              <Link href={`/admin/${election_id}/marked-ballots`} legacyBehavior>
                <a className={'marked-ballots' === section ? 'current' : ''} onClick={closeMenu}>
                  Marked Ballots
                </a>
              </Link>
            </>

            {/* Public pages section */}
            <>
              <label>
                <LinkOutlined style={{ marginRight: 5 }} />
                Public Pages
              </label>
              <Link href={`/election/${election_id}/vote`} legacyBehavior>
                <a target="_blank">Cast Vote</a>
              </Link>
              <Link href={`/election/${election_id}`} legacyBehavior>
                <a target="_blank">Election Results</a>
              </Link>
            </>
          </>
        )}
      </main>

      <div className="bottom">
        <label>
          <QuestionCircleOutlined style={{ marginRight: 5 }} />
          Support
        </label>
        <Link href="/protocol" legacyBehavior>
          <a target="_blank">Protocol Overview</a>
        </Link>
        <Link href="mailto:help@siv.org" legacyBehavior>
          <a>Get Help</a>
        </Link>
      </div>

      <style jsx>{`
        .sidebar {
          width: 215px;
          padding: 0px 13px;
          padding-left: 8px;
          background-color: #eee;

          height: 100%;

          overflow-y: auto;

          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          color: #010b26;
          margin: 16px 8px;
        }

        label {
          display: block;
          margin-top: 30px;
          opacity: 0.5;
          padding-left: 8px;
        }

        a {
          display: block;
          padding: 3px 8px;
          border-radius: 5px;
          margin: 4px 0;
          font-weight: 500;
          cursor: pointer;
          color: #000c;
          transition: 0.05s color linear;
          font-size: 16px;
        }

        a:hover {
          color: #000;
          background-color: #ffffff58;
          text-decoration: none;
        }

        a.current,
        a.current:hover {
          background-color: #fff !important;
        }

        a input {
          position: relative;
          bottom: 2px;
          margin-right: 8px;
        }

        .bottom {
          padding-bottom: 15px;
        }
      `}</style>
    </div>
  )
}
