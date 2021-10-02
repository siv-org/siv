export const BottomLabel = ({
  children,
  fadeIn,
  fadeInFast,
  name = '',
  small,
}: {
  children?: JSX.Element
  fadeIn?: boolean
  fadeInFast?: boolean
  name?: string
  small?: boolean
}) => {
  return (
    <>
      <label className={`${fadeIn ? 'fade-in' : ''} ${fadeInFast ? 'fade-in-fast' : ''} ${small ? 'small' : ''}`}>
        {children || name}
      </label>
      <style jsx>{`
        label {
          position: absolute;
          top: 110px;
          line-height: 17px;
          width: 93px;
          right: 0;
          text-align: center;
        }

        .small {
          font-size: 12px;
        }

        .fade-in-fast {
          animation .5s ease fade-in-fast;
        }

        @keyframes fade-in-fast {
          0%, 50% {
            opacity: 0;
          }
          100% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  )
}
