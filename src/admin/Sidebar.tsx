import Link from 'next/link'

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <>
        <label>Election Management</label>
        <Link href="/overview">
          <a>Overview</a>
        </Link>
        <Link href="/trustees">
          <a>Trustees</a>
        </Link>
        <Link href="/ballot-design">
          <a>Ballot Design</a>
        </Link>
        <Link href="/voters">
          <a>Voters</a>
        </Link>
      </>
      <>
        <label>Public pages</label>
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
          color: #000a;
          transition: 0.05s color linear;
          font-size: 16px;
        }

        a:hover {
          color: #000000f3;
          background-color: #ffffff58;
          text-decoration: none;
        }

        a.current {
          background-color: #ffffff28;
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
