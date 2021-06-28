import { UserOutlined } from '@ant-design/icons'
import Link from 'next/link'

import { logout, useUser } from './auth'
import { useStored } from './useStored'

export const HeaderBar = (): JSX.Element => {
  const { user } = useUser()
  const { election_id, election_title } = useStored()
  return (
    <div className="container">
      <section className="left">
        <Link href="/">
          <a className="big">SIV</a>
        </Link>
      </section>

      <section className="right">
        <div className="title">
          Managing: <i>{election_title}</i> <span>ID: {election_id}</span>
        </div>

        <div
          className="login-status"
          onClick={() => {
            const pressed_ok = confirm('Do you wish to logout?')
            if (pressed_ok) logout()
          }}
        >
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
          align-content: center;
        }

        .left {
          width: 215px;
          padding: 1rem;
        }

        .title span {
          display: block;
          text-transform: uppercase;
          font-size: 10px;
          opacity: 0.8;
        }

        .title {
          font-size: 14px;
        }

        .right {
          width: 100%;
          margin: 0 auto;
          padding: 1rem 3rem;

          display: flex;

          justify-content: space-between;
        }

        .big {
          font-size: 24px;
          font-weight: 700;
          color: #ddd;
        }

        .big:hover {
          color: #fff;
        }

        a:not(:first-child) {
          margin-left: 3rem;
          color: white;
          font-size: 16px;
          text-decoration: none;
          font-weight: 400;
        }

        a:hover {
          text-decoration: underline;
        }

        a.big:hover {
          text-decoration: none;
        }

        .login-status {
          font-size: 16px;
          padding: 3px 10px;
          border-radius: 4px;

          display: flex;
          align-items: center;
        }

        .login-status:hover {
          background: #fff2;
          cursor: pointer;
        }

        @media (max-width: 600px) {
          a:not(:first-child) {
            margin-left: 0;
            margin-top: 0.5rem;
          }

          .left {
            display: flex;
            flex-direction: column;
          }

          .container > div {
            flex-direction: column;
            padding: 1rem;
          }

          .login-status {
            margin-top: 0.5rem;
            margin-left: -10px;
          }
        }
      `}</style>
    </div>
  )
}
