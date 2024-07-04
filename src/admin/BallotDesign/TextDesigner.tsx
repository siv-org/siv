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
    </div>
  )
}
