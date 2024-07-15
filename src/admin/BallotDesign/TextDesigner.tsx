import dynamic from 'next/dynamic'

const CodeMirror = dynamic(() => import('./CodeMirror'), { ssr: false })

export const TextDesigner = ({ design, setDesign }: { design: string; setDesign: (s: string) => void }) => {
  return (
    <div className="relative flex-1">
      <CodeMirror
        height="auto"
        style={{ border: '1px solid #ccc', borderRadius: 3, borderTopRightRadius: 0 }}
        value={design}
        onChange={(value) => setDesign(value)}
      />

      {/* Advanced Features */}
      <div className="px-4">
        <h3>
          Advanced Features <span className="opacity-50">(not in Wizard)</span>
        </h3>

        <div>Per question:</div>
        <ul>
          <li>
            <code className="p-1 rounded bg-orange-100/70">
              {'"'}randomize_order{'"'}: true
            </code>{' '}
            - To improve fairness, randomize the displayed order of all options, unique per voter.
          </li>
        </ul>

        <div>Per option:</div>
        <ul>
          <li>
            <code className="p-1 rounded bg-orange-100/70">
              {'"'}sub{'"'}: {'"'}your sub-text here{'"'}
            </code>{' '}
            - Add extra info below an option, such as their Party Affiliation or a longer description.
          </li>
        </ul>
      </div>
    </div>
  )
}
