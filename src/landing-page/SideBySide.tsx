import { CSSProperties } from 'react'

import { Button } from './Button'

export const SideBySide = ({
  button,
  flipped,
  graphic,
  graphicCaption,
  headline,
  headlineStyle = {},
  noDarkFilter,
  smallHeadline,
  text,
}: {
  button?: { href: string; text: string }
  flipped?: boolean
  graphic: string
  graphicCaption?: string
  headline?: string | JSX.Element
  headlineStyle?: CSSProperties
  noDarkFilter?: boolean
  smallHeadline?: boolean
  text: string
}) => (
  <div className="container">
    <div>
      <img className={noDarkFilter ? 'no-dark-filter' : ''} src={`landing-page/${graphic}`} />
      <p className="caption">{graphicCaption}</p>
    </div>
    <div className="text-col">
      {smallHeadline ? (
        <>
          {headline && (
            <h4 className="primary" style={{ ...headlineStyle }}>
              {headline}
            </h4>
          )}
          <h3>{text}</h3>
        </>
      ) : (
        <>
          <h3 className="primary">{headline}</h3>
          <h4>{text}</h4>
          {button && (
            <div style={{ textAlign: 'center' }}>
              <Button href={button.href}>{button.text}</Button>
            </div>
          )}
        </>
      )}
    </div>

    <style jsx>{`
      .container {
        padding: 6vmax 17px;
        display: flex;
        flex-direction: ${flipped ? `row-reverse` : 'row'};
      }

      .container > div {
        flex: 1;
      }

      img {
        max-width: 100%;
        filter: brightness(85%);
      }

      img.no-dark-filter {
        filter: none;
      }

      .caption {
        color: #555;
        display: block;
        font-size: 14px;
        text-align: center;
        margin-top: 5px;
      }

      .text-col {
        margin-${flipped ? `right` : 'left'}: 9%;
        justify-content: center;
        display: flex;
        flex-direction: column;
      }

      .primary {
        color: #002868;
      }

      /* No headline margin needed when columned */
      @media (min-width: 700px) {
        .text-col > *:first-child {
          margin: 0;
        }
      }

      /* 1-column for small screens */
      @media (max-width: 700px) {
        .container {
          flex-direction: column;
          padding: 6.6vmax 0;
        }

        .text-col {
          margin: 0;
        }
      }
    `}</style>
  </div>
)
