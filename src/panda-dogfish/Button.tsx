export const Button = ({ children, href }: { children: string; href: string }): JSX.Element => (
  <a href={href}>
    {children}
    <style jsx>{`
      a {
        background: none;
        border: 2px solid #fff;
        border-radius: 0.4rem;
        color: white;
        padding: 1.2rem 2.004rem;
        text-decoration: none;
        transition: 0.1s background-color linear, 0.1s color linear;
        margin-top: 17px;
      }

      a:hover {
        background-color: #fff;
        color: #000;
      }
    `}</style>
  </a>
)
