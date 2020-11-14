export const Private = ({ children }: { children: string | JSX.Element | JSX.Element[] }) => (
  <div>
    <p>~~~~~~~ BEGIN PRIVATE ~~~~~~~</p>
    {children}
    <p>~~~~~~~~ END PRIVATE ~~~~~~~~</p>
    <style jsx>{`
      p {
        color: purple;
        margin: 0;
      }

      div {
        border: 2px dashed purple;
        padding: 1rem;
      }
    `}</style>
  </div>
)
