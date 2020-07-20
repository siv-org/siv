export const Section = ({ children }: { children: JSX.Element[] }): JSX.Element => (
  <div className="section">
    {children}
    <style jsx>{`
      .section {
        padding: 17px;
      }

      /* Small screens: reduce horiz padding */
      @media (max-width: 470px) {
        .section {
          padding: 17px 6vw;
        }
      }
    `}</style>
  </div>
)
