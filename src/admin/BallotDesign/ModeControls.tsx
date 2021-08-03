export const ModeControls = ({ selected, setSelected }: { selected: number; setSelected: (s: number) => void }) => {
  return (
    <div className="mode-controls">
      {['Wizard', 'Text', 'Split'].map((label, index) => (
        <span className={selected === index ? 'selected' : ''} key={index} onClick={() => setSelected(index)}>
          {label}
        </span>
      ))}

      <style jsx>{`
        .mode-controls {
          float: right;
        }
        span {
          border: 1px solid hsl(0, 0%, 76%);
          padding: 5px 15px;
          cursor: pointer;
          user-select: none;
        }
        span:hover {
          background-color: hsl(0, 0%, 97%);
        }
        span:active {
          background-color: hsl(0, 0%, 84%) !important;
          border-top-color: hsl(0, 0%, 70%);
        }
        span:not(:first-child) {
          border-left-width: 0px;
        }
        span.selected {
          background-color: hsl(0, 0%, 95%);
        }
      `}</style>
    </div>
  )
}
