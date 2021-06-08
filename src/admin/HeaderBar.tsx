import { UserOutlined } from '@ant-design/icons'
import Link from 'next/link'

import { logout } from './auth'

export const HeaderBar = (): JSX.Element => (
  <div className="container">
    <div>
      <div className="left">
        <Link href="/">
          <a className="big">Secure Internet Voting</a>
        </Link>
        <Link href="/protocol">
          <a>Protocol</a>
        </Link>
      </div>
      <div
        className="login-status"
        onClick={() => {
          const pressed_ok = confirm('Do you wish to logout?')
          if (pressed_ok) logout()
        }}
      >
        <UserOutlined />
        &nbsp; David Ernst
      </div>
    </div>
    <style jsx>{`
      .container {
        background: rgb(1, 5, 11);
        background: linear-gradient(90deg, #010b26 0%, #072054 100%);

        color: #fff;

        cursor: default;
      }

      .container > div {
        width: 100%;
        margin: 0 auto;
        padding: 1rem 3rem;

        display: flex;
        align-items: baseline;

        justify-content: space-between;
      }

      .big {
        font-size: 24px;
        font-weight: 700;
        color: white;
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

      @media (max-width: 480px) {
        a:not(:first-child) {
          margin-left: 0;
          margin-top: 0.5rem;
        }

        div {
          flex-direction: column;
        }
      }

      .login-status {
        font-size: 16px;
        padding: 3px 10px;
        border-radius: 4px;
      }

      .login-status:hover {
        background: #fff2;
        cursor: pointer;
      }
    `}</style>
  </div>
)
