import Intro from '../src/intro.mdx'

export default function CollapsibleIntro(): JSX.Element {
  return (
    <>
      <div className="collapsible">
        <Intro />

        {/* Fade to white */}
        <div className="fade-to-white">
          <p>Expand full intro</p>
        </div>
      </div>
      <style jsx>{`
        .collapsible {
          height: 380px;
          overflow: hidden;
          position: relative;
        }

        .fade-to-white {
          position: absolute;
          bottom: 0;
          height: 100px;
          //   border: 1px solid green;
          width: 100%;
          background: linear-gradient(#fff5, #fff);
          display: flex;
          justify-content: center;
        }

        .fade-to-white p {
          align-self: center;
          text-align: center;
          background-color: #fff;
          border: 1px solid #ccc;
          width: 130px;
          border-radius: 20px;
        }
      `}</style>
    </>
  )
}
