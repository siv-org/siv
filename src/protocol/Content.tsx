import { Accordion, AccordionSummary as Summary } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'

import styles from './protocol.module.css'
import steps, { ImageLine, Line, ReactLine, Step, Subsection, header, prepSteps } from './steps'

export default function Protocol(): JSX.Element {
  return (
    <div style={{ backgroundColor: '#e5eafd', paddingBottom: '2rem' }}>
      {/* Header */}
      <div className={styles.protocol}>
        <a id="protocol" />
        <div style={{ padding: '10px 16px' }}>
          {header.map((line, lineIndex) => {
            const type = Object.keys(line)[0]
            const text = Object.values(line)[0] as string

            return (
              <p className={styles[type]} key={lineIndex}>
                {text}
              </p>
            )
          })}
        </div>

        {/* Prep steps */}
        <Accordion defaultExpanded>
          <Summary expandIcon={<ExpandMore />}>
            <p className={styles.name}>Prep Steps</p>
          </Summary>
          <div className={styles.prepContainer}>{prepSteps.map(renderStep)}</div>
        </Accordion>

        {/* Main steps */}
        {steps.map(renderStep)}
      </div>

      {/* Fin step */}
      <div style={{ textAlign: 'center' }}>
        <img src={`./protocol/step-fin.png`} style={{ maxWidth: 600, width: '100%' }} />
      </div>
    </div>
  )
}

// Wrap individual step in an Accordion
function renderStep({ defaultExpanded = true, name, rest }: Step, stepIndex: number) {
  return (
    <Accordion defaultExpanded={defaultExpanded} key={stepIndex}>
      <Summary expandIcon={<ExpandMore />}>
        <p className={styles.name}>{name}</p>
      </Summary>
      <div className={styles.expanded}>{rest.map(renderLine)}</div>
    </Accordion>
  )
}

// Converts our text lines into formatted html
function renderLine(line: Line, lineIndex: number) {
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
