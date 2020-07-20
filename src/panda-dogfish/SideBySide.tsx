export const SideBySide = ({
  flipped,
  graphic,
  graphicCaption,
  headline,
  text,
}: {
  flipped?: boolean
  graphic: string
  graphicCaption?: string
  headline: string | JSX.Element
  text: string
}) => (
  <div className="container">
    <div>
      <img src={`panda-dogfish/${graphic}`} />
      <p className="caption">{graphicCaption}</p>
    </div>
    <div className="text-col">
      <h4>{headline}</h4>
      <h3>{text}</h3>
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
        h4 {
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
