import { JumboBlue } from './JumboBlue'

export const BuiltUpon = (): JSX.Element => (
  <JumboBlue>
    <h2>
      Built upon decades of research and hard work by uncountable contributors, in academia, industry, and the public
      sector.
    </h2>
    <p>And ready to be used right now, if only our elected officials will allow it.</p>

    <style jsx>{`
      h2 {
        padding: 17px;
        text-align: center;
      }

      p {
        text-align: center;
      }
    `}</style>
  </JumboBlue>
)
