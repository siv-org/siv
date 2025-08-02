export const ModeControls = ({ selected, setSelected }: { selected: number; setSelected: (s: number) => void }) => {
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
    </div>
  )
}
