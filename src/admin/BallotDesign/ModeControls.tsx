import { UploadBallotDesignButton } from './UploadBallotDesignButton'

export const ModeControls = ({
  election_id,
  onUploadMessage,
  selected,
  setDesign,
  setSelected,
  showUpload,
}: {
  election_id?: string
  onUploadMessage?: (message: string, status: 'error' | 'success') => void
  selected: number
  setDesign?: (design: string) => void
  setSelected: (s: number) => void
  showUpload?: boolean
}) => {
  return (
    <div className="float-right">
      {['Wizard', 'JSON', 'Split'].map((label, index) => (
        <span
          className={`select-none cursor-pointer border border-solid border-gray-400/70 [&:not(:first-child)]:border-l-0 hover:bg-gray-50 active:bg-gray-200 px-[15px] py-[5px] ${
            selected === index ? '!bg-gray-100' : ''
          }`}
          key={index}
          onClick={() => setSelected(index)}
        >
          {label}
        </span>
      ))}
      {showUpload && setDesign && (
        <UploadBallotDesignButton election_id={election_id} onMessage={onUploadMessage} setDesign={setDesign} />
      )}
    </div>
  )
}
