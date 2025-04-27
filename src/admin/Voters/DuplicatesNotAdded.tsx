import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

export const DuplicatesNotAdded = ({
  removedDuplicates,
  setRemovedDuplicates,
}: {
  removedDuplicates: string[]
  setRemovedDuplicates: (duplicates: string[]) => void
}) => {
  if (!removedDuplicates?.length) return null

  return (
    <div className="relative flex items-start gap-3 p-4 my-4 rounded-lg shadow bg-yellow-50">
      {/* ! Icon */}
      <ExclamationCircleOutlined className="text-xl text-yellow-500" />

      {/* Content */}
      <div>
        {/* Title */}
        <div className="text-base font-semibold text-yellow-800">
          {removedDuplicates.length} Duplicate{removedDuplicates.length > 1 ? 's' : ''} Not Added:
        </div>

        <ol className="mt-2 ml-2 text-sm text-yellow-900 list-decimal">
          {removedDuplicates.map((email) => (
            <li key={email}>{email}</li>
          ))}
        </ol>
      </div>

      {/* Dismiss Button */}
      <button
        className="absolute w-8 h-8 p-0 transition-colors bg-transparent border-none rounded-full cursor-pointer top-2 right-2 hover:bg-yellow-200 focus:outline-none"
        onClick={() => setRemovedDuplicates([])}
      >
        <CloseOutlined className="text-lg text-yellow-600 transition-colors hover:text-yellow-800 relative top-0.5" />
      </button>
    </div>
  )
}
