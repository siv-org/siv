import { json } from '@codemirror/lang-json'
import { tags as t } from '@lezer/highlight'
import { githubLightInit } from '@uiw/codemirror-theme-github'
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror'

const CodeMirrorComponent = (props: ReactCodeMirrorProps) => (
  <>
    <CodeMirror
      {...props}
      basicSetup={{ foldGutter: false }}
      extensions={[json()]}
      theme={githubLightInit({
        settings: { foreground: 'hsl(0, 0%, 60%)', gutterBackground: '#f8f8f8', gutterForeground: '#999' },
        styles: [
          { color: 'rgb(23, 26, 79)', tag: t.propertyName },
          { color: 'green', tag: t.string },
          { color: 'rgb(116, 69, 0)', fontWeight: 'bold', tag: t.bool },
        ],
      })}
    />
    <style global jsx>{`
      .cm-focused {
        outline: none !important;
      }
    `}</style>
  </>
)

export default CodeMirrorComponent
