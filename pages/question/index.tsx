import { useRouter } from 'next/router'
import { GlobalCSS } from 'src/GlobalCSS'

import { CreatorPage } from './CreatorPage'
import { ResponsePage } from './ResponsePage'

const QuestionPage = () => {
  const { query } = useRouter()
  const { q, req } = query

  return (
    <div>
      <section>{!(req && q) ? <CreatorPage /> : <ResponsePage />}</section>
      <GlobalCSS />

      <style jsx>{`
        div {
          background: rgb(225, 227, 255);
          background-image: linear-gradient(to right bottom, #ece3ff, #dfe8ff, #d0ecff, #c4f1ff, #bcf5ff);
          color: #000b;
        }

        section {
          max-width: 1000px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  )
}

export default QuestionPage
