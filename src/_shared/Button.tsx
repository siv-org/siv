import Link from 'next/link'
import { forwardRef } from 'react'

export const darkBlue = '#002868'

type ButtonProps = {
  background?: string
  children: JSX.Element | string
  className?: string
  style?: React.CSSProperties
}

export const Button = ({
  children,
  href,
  style = {},
}: ButtonProps & {
  href: string
}): JSX.Element => (
  <Link
    className="inline-block border-2 border-solid font-bold no-underline hover:no-underline m-[17px] rounded-[0.4rem] bg-transparent py-[1.2rem] px-[2.004rem] transition-colors duration-100 ease-linear border-[#002868] text-[#002868] hover:bg-[#002868] hover:text-white"
    {...{ children, href, style }}
  />
)

type OnClickProps = ButtonProps & {
  disabled?: boolean
  disabledOnClickMessage?: false | string
  error?: boolean
  helperText?: string
  id?: string
  invertColor?: boolean
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
      disabledOnClickMessage,
      error,
      helperText,
      id,
      invertColor,
      noBorder,
      onClick,
      style = {},
    }: OnClickProps,
    ref,
  ): JSX.Element => (
    <>
      <a
        className={`${disabled ? 'disabled' : ''} ${className}`}
        id={id}
        onClick={() => {
          if (!disabled) return onClick()
          if (disabledOnClickMessage) alert(disabledOnClickMessage)
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
            background-color: ${invertColor ? '#fff' : darkBlue};
            color: ${invertColor ? '#000' : '#fff'};
            cursor: pointer;
          }
        `}</style>
      </a>
      {helperText && <div className={`${error ? 'text-red-500' : 'text-gray-500'}`}>{helperText}</div>}
    </>
  ),
)
OnClickButton.displayName = 'OnClickButton'
