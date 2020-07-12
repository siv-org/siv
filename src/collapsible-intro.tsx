import { useState } from 'react'

import Intro from '../src/intro.mdx'

export default function CollapsibleIntro(): JSX.Element {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <>
      <div
        className={`collapsible ${collapsed ? 'collapsed' : ''}`}
        style={{
          height: collapsed ? 380 : 'initial',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Intro />

        {/* Fade to white */}
        {collapsed && (
          <div
            style={{
              background: 'linear-gradient(#fcfcfc55, #fcfcfc)',
              bottom: 0,
              display: 'flex',
              height: 100,
              justifyContent: 'center',
              position: 'absolute',
              width: '100%',
            }}
          >
            <p
              onClick={() => setCollapsed(!collapsed)}
              style={{
                alignSelf: 'center',
                backgroundColor: '#f0f6fa',
                border: '1px solid #0004',
                borderRadius: 20,
                color: '#042c47aa',
                cursor: 'pointer',
                fontWeight: 600,
                padding: '3px 0px',
                textAlign: 'center',
                width: 145,
              }}
            >
              Show Full Intro
            </p>
          </div>
        )}
        <style jsx>{`
          @media only screen and (max-width: 524px) {
            .collapsible.collapsed {
              height: 400px !important;
            }
          }

          p:hover {
            border-color: #0e4468 !important;
          }
        `}</style>
      </div>
    </>
  )
}
