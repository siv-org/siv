const darkBlue = '#002868'

export const Button = ({
  children,
  href,
  invertColor,
}: {
  children: string
  href: string
  invertColor?: boolean
}): JSX.Element => (
  <a href={href}>
    {children}
    <style jsx>{`
      a {
        background: none;
        border: 2px solid ${invertColor ? '#fff' : darkBlue};
        border-radius: 0.4rem;
        color: ${invertColor ? '#fff' : darkBlue};
        padding: 1.2rem 2.004rem;
        text-decoration: none;
        transition: 0.1s background-color linear, 0.1s color linear;
        margin-top: 17px;
      }

      a:hover {
        background-color: ${invertColor ? '#fff' : darkBlue};
        color: ${invertColor ? '#000' : '#fff'};
      }
    `}</style>
  </a>
)
