import { UserOutlined } from '@ant-design/icons'
import Head from 'next/head'
import Link from 'next/link'

import { promptLogout, useUser } from './auth'
import { useStored } from './useStored'

export const HeaderBar = (): JSX.Element => {
  const { user } = useUser()
  const { election_id, election_title } = useStored()
  return (
    <div className="container">
      <section className="left">
        <Link href="/">
          <a className="logo">SIV</a>
        </Link>
      </section>

      <section className="right">
        <div className="title">
          {election_id && (
            <>
              <Head>
                <title key="title">SIV: Manage {election_title}</title>
              </Head>
              <Link href="/admin">
                <a
                  className="back-btn"
                  onClick={() => {
                    const el = document.getElementById('main-content')
                    if (el) el.scrollTop = 0
                  }}
                >
                  ←
                </a>
              </Link>
              <div className="current-election">
                Managing: <i>{election_title}</i> <span>ID: {election_id}</span>
              </div>
            </>
          )}
        </div>

        <div className="login-status" onClick={promptLogout}>
          <UserOutlined />
          &nbsp; {user.name}
        </div>
      </section>
      <style jsx>{`
        .container {
          background: rgb(1, 5, 11);
          background: linear-gradient(90deg, #010b26 0%, #072054 100%);

          color: #fff;

          display: flex;

          width: 100%;
        }

        .left {
          min-width: 200px;
          padding: 1rem 0;
        }

        @media (max-width: 650px) {
          .left {
            min-width: 80px;
          }
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          color: #ddd;
          padding: 1rem;
        }

        .logo:hover {
          color: #fff;
          text-decoration: none;
        }

        .right {
          width: 100%;
          padding: 1rem 0rem;

          display: flex;

          justify-content: space-between;
        }

        .title {
          display: flex;
        }

        .back-btn {
          margin-right: 18px;
          color: #fff;
          opacity: 0.4;
          border-radius: 100px;
          width: 30px;
          height: 30px;
          line-height: 30px;
          font-weight: 700;
          text-align: center;
        }

        .back-btn:hover {
          opacity: 0.9;
          background: #fff2;
          cursor: pointer;
          text-decoration: none;
        }

        .current-election span {
          display: block;
          text-transform: uppercase;
          font-size: 10px;
          opacity: 0.8;
        }

        .current-election {
          font-size: 14px;
        }

        .login-status {
          font-size: 16px;
          padding: 3px 10px;
          border-radius: 4px;

          display: flex;
          align-items: center;

          margin-right: 1rem;
        }

        .login-status:hover {
          background: #fff2;
          cursor: pointer;
        }

        /* When Sidebar disappears */
        @media (max-width: 500px) {
          .container {
            justify-content: space-between;
          }

          .right {
            width: initial;
            margin-right: 1rem;
          }

          .back-btn {
            margin-right: 10px;
          }

          .login-status {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
