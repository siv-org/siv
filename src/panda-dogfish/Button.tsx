const darkBlue = '#002868'

export const Button = ({
  children,
  href,
  invertColor,
  style = {},
}: {
  children: string
  href: string
  invertColor?: boolean
  style?: React.CSSProperties
}): JSX.Element => (
  <a href={href} style={style}>
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
)
