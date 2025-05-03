export const PrivateBox = ({ children }: { children: JSX.Element | JSX.Element[] | string }) => (
  <div>
    <p>BEGIN PRIVATE</p>
    {children}
    <p>END PRIVATE</p>
    <style jsx>{`
      p {
        color: rgba(128, 0, 128, 0.7);
        margin: 0;
        position: absolute;
        background: white;
        font-size: 12px;
        padding: 0 3px;
      }

      p:first-child {
        top: -10px;
      }

      p:last-child {
        bottom: -8px;
      }

      div {
        border: 2px dashed rgba(128, 0, 128, 0.4);
        padding: 0.5rem 1rem;
        position: relative;
        margin-bottom: 30px;
      }
    `}</style>
  </div>
)
