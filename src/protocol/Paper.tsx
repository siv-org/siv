/** Paper w/ drop shadow */
export const Paper = ({
  children,
  marginBottom,
  noFade,
  style,
}: {
  children: JSX.Element[] | JSX.Element
  marginBottom?: boolean
  noFade?: boolean
  style?: React.CSSProperties
}) => (
  <>
    <div style={style}>{children}</div>
    <style jsx>{`
      div {
        border-radius: 4px;

        box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14),
          0px 1px 8px 0px rgba(0, 0, 0, 0.12);

        margin-bottom: ${marginBottom ? '30px' : 0};

        opacity: ${noFade ? 1 : 0.7};
        overflow-wrap: break-word;
        padding: 0.5rem 1.5rem;
      }
    `}</style>
  </>
)
