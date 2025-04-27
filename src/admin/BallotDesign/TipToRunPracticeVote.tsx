import { BulbOutlined } from '@ant-design/icons'

export const TipToRunPracticeVote = () => {
  return (
    <div className="p-2 sm:mb-0 mb-1.5 border-2 border-blue-200 border-solid rounded-lg bg-blue-50">
      <span className="mr-1 font-semibold">
        <BulbOutlined className="mr-1" />
        Tip:
      </span>
      A quick practice vote can fix issues and calm nerves before the real thing.
    </div>
  )
}
