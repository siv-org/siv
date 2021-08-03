import dynamic from 'next/dynamic'

const CodeMirror = dynamic(import('./CodeMirror'), { ssr: false })

export const TextDesigner = ({ design, setDesign }: { design: string; setDesign: (s: string) => void }) => {
  return (
    <div>
      <CodeMirror
        options={{
          lineNumbers: true,
          mode: 'application/json',
          theme: 'idea',
        }}
        value={design}
        onBeforeChange={(editor, data, value) => {
          setDesign(value)
        }}
      />

      <style jsx>{`
        div {
          flex: 1;
          position: relative;
        }
      `}</style>
      <style global jsx>{`
        .react-codemirror2 {
          border: 1px solid #ccc;
          border-radius: 4px;
          border-top-right-radius: 0;
          font-size: 12px;
        }
        .CodeMirror {
          height: unset;
          color: hsl(0, 0%, 58%) !important;
        }
        span.cm-property {
          color: rgb(23, 26, 79) !important;
        }
      `}</style>
    </div>
  )
}
