export const SideBySide = ({
  flipped,
  graphic,
  graphicCaption,
  headline,
  smallHeadline,
  text,
}: {
  flipped?: boolean
  graphic: string
  graphicCaption?: string
  headline: string | JSX.Element
  smallHeadline?: boolean
  text: string
}) => (
  <div className="container">
    <div>
      <img src={`panda-dogfish/${graphic}`} />
      <p className="caption">{graphicCaption}</p>
    </div>
    <div className="text-col">
      {smallHeadline ? (
        <>
          <h4>{headline}</h4>
          <h3>{text}</h3>
        </>
      ) : (
        <>
          <h3>{headline}</h3>
          <h4>{text}</h4>
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

      .caption {
        color: #555;
        display: block;
        font-size: 14px;
        text-align: center;
        margin-top: 5px;
      }

      .text-col {
        margin-${flipped ? `right` : 'left'}: 9%;
      }

      /* Large screens: top align text */
      @media (min-width: 700px) {
        .text-col > *:first-child {
          margin-top: 0;
        }
      }

      /* Small screens: show vertically */
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
