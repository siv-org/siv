import dynamic from 'next/dynamic'

import { AdvancedFeatures } from './AdvancedFeatures'

const CodeMirror = dynamic(() => import('./CodeMirror'), { ssr: false })

export const JsonEditor = ({ design, setDesign }: { design: string; setDesign: (s: string) => void }) => {
  return (
    <div className="relative flex-1">
      <CodeMirror
        height="auto"
        onChange={(value) => setDesign(value)}
        style={{ border: '1px solid #ccc', borderRadius: 3, borderTopRightRadius: 0 }}
        value={design}
      />

      <AdvancedFeatures />
    </div>
  )
}
