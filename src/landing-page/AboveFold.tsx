import { Link } from 'react-scroll'

import { JumboBlue } from './JumboBlue'

export const AboveFold = ({ height, showButton = true }: { height?: number; showButton?: boolean }): JSX.Element => (
  <JumboBlue height={height}>
    <h1 style={{ margin: '4rem 0 0', padding: 17, textAlign: 'center' }}>Fast. Private. Verifiable</h1>
    <>
      {showButton && (
        <Link id="above-fold-btn" offset={-25} smooth={true} to="let-your-govt-know">
          Bring To Your Community
        </Link>
      )}
    </>
    <style global jsx>{`
      #above-fold-btn {
        background: none;
        border: 2px solid #fff;
        border-radius: 0.4rem;
        color: #fff;
        display: inline-block;
        font-weight: bold;
        margin: 17px;
        padding: 1.2rem 2.004rem;
        text-decoration: none;
        transition: 0.1s background-color linear, 0.1s color linear;
      }

      #above-fold-btn:hover {
        background-color: #fff;
        color: #000;
        cursor: pointer;
      }
    `}</style>
  </JumboBlue>
)
