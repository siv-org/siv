import { useState } from 'react'

import Intro from '../src/intro.mdx'

export default function CollapsibleIntro(): JSX.Element {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <>
      <div
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
            className="fade-to-white"
            style={{
              background: 'linear-gradient(#fff5, #fff)',
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
                border: '1px solid #0005',
                borderRadius: 20,
                color: '#0009',
                cursor: 'pointer',
                textAlign: 'center',
                width: 130,
              }}
            >
              Read full intro
            </p>
          </div>
        )}
      </div>
    </>
  )
}
