import { zebraStripes } from '@uiw/codemirror-extensions-zebra-stripes'
import { createTheme } from '@uiw/codemirror-themes'
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror'

const theme = createTheme({
  settings: {
    caret: '#0070f3',
    fontFamily: 'sans-serif',
    foreground: '#444',
    gutterBackground: '#fff',
    gutterForeground: '#999',
    lineHighlight: '#eef6ffe8 !important',
    selectionMatch: '#036dd626',
  },
  styles: [],
  theme: 'light',
})

const CodeMirrorComponent = (props: ReactCodeMirrorProps) => (
  <>
    <CodeMirror {...props} extensions={[zebraStripes({ step: 2 })]} theme={theme} />
    <style global jsx>{`
      .cm-focused {
        outline: none !important;
      }
      .cm-editor {
        font-size: 15px;
      }
      .cm-zebra-stripe {
        background-color: #8881 !important;
      }
      .cm-cursor {
        border-left-width: 2px !important;
      }
    `}</style>
  </>
)

export default CodeMirrorComponent
