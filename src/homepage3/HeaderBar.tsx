import { darkBlue } from './colors'

export const HeaderBar = () => (
  <header>
    <h3>SIV</h3>
    <span>
      <a href="/faq">FAQ</a>
      <a href="/protocol">Protocol</a>
      <a href="/about">Research</a>
      <a href="/admin">Sign In</a>
    </span>
    <style jsx>{`
      header {
        display: flex;
        justify-content: space-between;
        padding-top: 1rem;
      }

      h3 {
        margin: 0;
        color: ${darkBlue};
        font-size: 24px;
      }

      a {
        color: ${darkBlue};
        text-decoration: none;
        padding: 0 13px;
        margin: 0 3px;
        font-size: 18px;
        font-weight: 500;
      }

      a:hover {
        text-decoration: underline;
      }

      a:last-child {
        margin-left: 35px;
      }
    `}</style>
  </header>
)
