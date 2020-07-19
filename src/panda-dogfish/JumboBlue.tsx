export const JumboBlue = ({ children }: { children: JSX.Element[] }): JSX.Element => (
  <div>
    {children}

    <style jsx>{`
      div {
        align-items: center;
        background: rgb(1, 5, 11);
        background: linear-gradient(90deg, rgb(1, 5, 11) 0%, rgb(8, 33, 79) 65%, rgb(8, 35, 83) 100%);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 100vh;
        padding: 10vmax 7vw;
      }
    `}</style>
  </div>
)
