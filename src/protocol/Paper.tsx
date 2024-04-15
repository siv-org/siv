/** Paper w/ drop shadow */
export const Paper = ({
  children,
  className,
  marginBottom,
  noFade,
  style,
}: {
  children: JSX.Element[] | JSX.Element
  className?: string
  marginBottom?: boolean
  noFade?: boolean
  style?: React.CSSProperties
}) => (
  <>
    <div {...{ className, style }} className={`rounded break-words py-2 px-6  ${className}`}>
      {children}
    </div>
    <style jsx>{`
      div {
        box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14),
          0px 1px 8px 0px rgba(0, 0, 0, 0.12);

        margin-bottom: ${marginBottom ? '30px' : 0};
        opacity: ${noFade ? 1 : 0.7};
      }
    `}</style>
  </>
)
