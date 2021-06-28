import Link from 'next/link'
import { useRouter } from 'next/router'

export const Sidebar = () => {
  const { section } = useRouter().query

  const sections = ['Overview', 'Trustees', 'Ballot Design', 'Voters']
  const urled = (s: string) => s.toLowerCase().replaceAll(' ', '-')

  return (
    <div className="sidebar">
      <>
        <label>Election Management</label>
        {sections.map((s) => (
          <Link href={`./${urled(s)}`} key={s}>
            <a className={urled(s) === section ? 'current' : ''}>{s}</a>
          </Link>
        ))}
      </>
      <>
        <label>Public Pages</label>
        <Link href="/voters">
          <a>Vote page</a>
        </Link>
        <Link href="/voters">
          <a>Status page</a>
        </Link>
      </>
      <label></label>
      <style jsx>{`
        .sidebar {
          min-width: 215px;
          padding: 0px 13px;
          background-color: #eee;
          height: calc(100vh - 66px);
        }

        label {
          display: block;
          margin-top: 30px;
          opacity: 0.5;
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

        a.current {
          background-color: #fff;
        }

        /* Hide for small screens */
        @media (max-width: 1030px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
