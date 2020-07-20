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
        padding: 17px;
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

      h4 {
        margin-top: 0;
      }
    `}</style>
  </div>
)
