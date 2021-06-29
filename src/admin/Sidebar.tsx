import { ApartmentOutlined, LinkOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useStored } from './useStored'

export const Sidebar = () => {
  const { election_id, section } = useRouter().query
  const { ballot_design, threshold_public_key } = useStored()

  const sections: [string, boolean][] = [
    ['Trustees', !!threshold_public_key],
    ['Ballot Design', !!ballot_design],
    ['Voters', true],
  ]
  const urled = (s: string) => s.toLowerCase().replaceAll(' ', '-')

  return (
    <div className="sidebar">
      {election_id ? (
        <main>
          <>
            <label>
              <ApartmentOutlined style={{ marginRight: 5 }} /> Election Management
            </label>
            {sections.map(([name, completed]) => (
              <Link href={`./${urled(name)}`} key={name}>
                <a className={urled(name) === section ? 'current' : ''}>
                  {name !== 'Voters' ? (
                    <input readOnly checked={completed} type="checkbox" />
                  ) : (
                    <div className="voters-box" />
                  )}
                  {name}
                </a>
              </Link>
            ))}
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
        </main>
      ) : (
        <></>
      )}

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

          height: calc(100vh - 66px);

          overflow-y: scroll;

          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* Hide for small screens */
        @media (max-width: 500px) {
          .sidebar {
            display: none;
          }
        }

        label {
          display: block;
          margin-top: 30px;
          opacity: 0.5;
          padding-left: 8px;
        }

        a:not(.all-elections) {
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

        a:hover:not(.all-elections) {
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
