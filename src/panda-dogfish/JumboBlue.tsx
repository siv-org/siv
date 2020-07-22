export const JumboBlue = ({ children }: { children: JSX.Element[] }): JSX.Element => (
  <div>
    {children}

    <style jsx>{`
      div {
        align-items: center;
        background: rgb(1, 5, 11);
        background: linear-gradient(90deg, #010b26 0%, #072054 100%);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 99vh;
        padding: 10vmax 7vw;
      }

      /* wider bg gradient for large screens */
      @media (min-width: 800px) {
        div {
          background: linear-gradient(90deg, #000 0%, #041640 50%, #061e51 65%, #071f53 100%);
        }
      }
    `}</style>
  </div>
)
