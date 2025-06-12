import Link from 'next/link'
import { forwardRef } from 'react'

export const darkBlue = '#002868'

type ButtonProps = {
  background?: string
  children: JSX.Element | string
  className?: string
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
  <Link href={href}>
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

type OnClickProps = ButtonProps & {
  disabled?: boolean
  disabledExplanation?: false | string
  id?: string
  noBorder?: boolean
  onClick: () => void
}
export const OnClickButton = forwardRef<HTMLAnchorElement, OnClickProps>(
  (
    {
      background,
      children,
      className = '',
      disabled,
      disabledExplanation,
      id,
      invertColor,
      noBorder,
      onClick,
      style = {},
    }: OnClickProps,
    ref,
  ): JSX.Element => (
    <a
      className={`${disabled ? 'disabled' : ''} ${className}`}
      id={id}
      onClick={() => {
        if (disabledExplanation) alert(disabledExplanation)
        if (!disabled) onClick()
      }}
      ref={ref}
      style={style}
    >
      {children}
      <style jsx>{`
        a {
          ${background && `background: ${background}`};
          border: 2px solid ${invertColor && !noBorder ? '#fff' : darkBlue};
          border-radius: 0.4rem;
          color: ${invertColor ? '#fff' : darkBlue};
          display: flex;
          align-items: center;
          justify-content: center;
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
          background-color: ${invertColor ? '#fff' : darkBlue};
          color: ${invertColor ? '#000' : '#fff'};
          cursor: pointer;
        }
      `}</style>
    </a>
  ),
)
OnClickButton.displayName = 'OnClickButton'
