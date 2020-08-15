import Link from 'next/link'

const darkBlue = '#002868'

type ButtonProps = {
  background?: string
  children: string
  invertColor?: boolean
  style?: React.CSSProperties
}

export const Button = ({
  children,
  href,
  invertColor,
  style = {},
}: ButtonProps & {
  href: string
}): JSX.Element => (
  <Link href={href} prefetch={href.startsWith('/') ? undefined : false}>
    <a style={style}>
      {children}
      <style jsx>{`
        a {
          background: none;
          border: 2px solid ${invertColor ? '#fff' : darkBlue};
          border-radius: 0.4rem;
          color: ${invertColor ? '#fff' : darkBlue};
          display: inline-block;
          font-weight: bold;
          margin: 17px;
          padding: 1.2rem 2.004rem;
          text-decoration: none;
          transition: 0.1s background-color linear, 0.1s color linear;
        }

        a:hover {
          background-color: ${invertColor ? '#fff' : darkBlue};
          color: ${invertColor ? '#000' : '#fff'};
        }
      `}</style>
    </a>
  </Link>
)

export const OnClickButton = ({
  children,
  disabled,
  onClick,
  background,
  style = {},
}: ButtonProps & {
  disabled?: boolean
  onClick: () => void
}): JSX.Element => (
  <a className={disabled ? 'disabled' : ''} style={style} onClick={() => !disabled && onClick()}>
    {children}
    <style jsx>{`
      a {
        ${background && `background: ${background}`};
        border: 2px solid ${darkBlue};
        border-radius: 0.4rem;
        color: ${darkBlue};
        display: inline-block;
        font-weight: bold;
        margin: 17px;
        padding: 1.2rem 2.004rem;
        text-decoration: none;
        transition: 0.1s background-color linear, 0.1s color linear;
      }

      a:hover {
        text-decoration: none;
      }

      .disabled {
        opacity: 0.4;
        cursor: default;
      }

      a:not(.disabled):hover {
        background-color: ${darkBlue};
        color: ${'#fff'};
        cursor: pointer;
      }
    `}</style>
  </a>
)
