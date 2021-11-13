import { ApartmentOutlined, LinkOutlined, QuestionCircleOutlined, SnippetsOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useStored } from './useStored'

export const Sidebar = () => (
  <div className="sidebar">
    <SidebarContent />
    <style jsx>{`
      .sidebar {
        height: calc(100vh - 66px);
      }

      /* Hide for small screens */
      @media (max-width: 500px) {
        .sidebar {
          display: none;
        }
      }
    `}</style>
  </div>
)

export const steps = ['Ballot Design', 'Observers', 'Voters']

export const SidebarContent = ({ closeMenu = () => {} }: { closeMenu?: () => void }) => {
  const { election_id, section } = useRouter().query
  const { ballot_design_finalized, threshold_public_key } = useStored()

  const completed: Record<typeof steps[number], boolean> = {
    'Ballot Design': !!ballot_design_finalized,
    Observers: !!threshold_public_key,
    Voters: true,
  }
  const urled = (s: string) => s.toLowerCase().replaceAll(' ', '-')

  return (
    <div className="sidebar">
      <main>
        <h2 className="logo">SIV</h2>
        {election_id && (
          <>
            <>
              <label>
                <ApartmentOutlined style={{ marginRight: 5 }} /> Election Management
              </label>
              {steps.map((name) => (
                <Link href={`/admin/${election_id}/${urled(name)}`} key={name}>
                  <a className={urled(name) === section ? 'current' : ''} onClick={closeMenu}>
                    {name !== 'Voters' && <input readOnly checked={completed[name]} type="checkbox" />}
                    {name}
                  </a>
                </Link>
              ))}
            </>
            <>
              <label>
                <SnippetsOutlined style={{ marginRight: 5 }} />
                Post Election
              </label>
              <Link href={`/admin/${election_id}/marked-ballots`}>
                <a className={'marked-ballots' === section ? 'current' : ''} onClick={closeMenu}>
                  Marked Ballots
                </a>
              </Link>
            </>
            <>
              <label>
                <LinkOutlined style={{ marginRight: 5 }} />
                Public Pages
              </label>
              <Link href={`/election/${election_id}/vote`}>
                <a target="_blank">Cast Vote</a>
              </Link>
              <Link href={`/election/${election_id}`}>
                <a target="_blank">Election Status</a>
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
        <Link href="/protocol">
          <a target="_blank">Protocol Overview</a>
        </Link>
        <Link href="mailto:help@secureinternetvoting.org">
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

          overflow-y: scroll;

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

        /* Rules for persistent sidebar */
        @media (min-width: 500px) {
          .logo {
            display: none;
          }
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
