import styles from './protocol.module.css'
import { ImageLine, Line as LineObj, ReactLine, Subsection } from './steps'

// Converts our text lines into formatted html
export const Line = (line: LineObj, lineIndex: number) => {
  // Special handling for breaks
  if (line === '') {
    return <br key={lineIndex} />
  }

  const type = Object.keys(line)[0]

  // Special handling for images
  if (type === 'image') {
    const { image, maxWidth } = line as ImageLine

    return <img key={lineIndex} src={`./protocol/${image}`} style={{ maxWidth, width: '100%' }} />
  }

  // Special handling for subsections
  if (type === 'subsection') {
    const { header, list } = (line as Subsection).subsection
    return (
      <div key={lineIndex} style={{ padding: '2rem 6%' }}>
        <p style={{ fontSize: 14, fontWeight: 700 }}>{header}:</p>
        <ul style={{ fontSize: 7, paddingInlineStart: 13 }}>
          {list.map((item, listIndex) => (
            <li key={listIndex} style={{ marginBottom: 15 }}>
              <span dangerouslySetInnerHTML={{ __html: item }} style={{ fontSize: 14, position: 'relative', top: 2 }} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // Special handing for react nodes
  if (type === 'react') {
    const Element = (line as ReactLine).react
    return <Element key={lineIndex} />
  }

  // Otherwise it's text
  const text = Object.values(line)[0] as string

  // Special handling to embed html
  if (type === 'html') {
    return <div dangerouslySetInnerHTML={{ __html: text }} key={lineIndex} />
  }

  return (
    <p className={styles[type]} key={lineIndex}>
      {/* label for 'Example:' */}
      {type === 'example' && <em>Example: </em>}

      {/* Split on newlines */}
      {text.split('\n').map((item, key) => (
        <span key={key}>
          {item}
          <br />
        </span>
      ))}
    </p>
  )
}
