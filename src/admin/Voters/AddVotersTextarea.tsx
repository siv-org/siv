import dynamic from 'next/dynamic'

const CodeMirror = dynamic(() => import('./AddVotersCodeMirror'), { ssr: false })

export const AddVoterTextarea = ({ state, update }: { state: string; update: (s: string) => void }) => {
  return (
    <CodeMirror
      height="auto"
      maxHeight="300px"
      onChange={(value) => update(value)}
      style={{ border: '1px solid #ccc', borderRadius: 3 }}
      value={state}
    />
  )
}
