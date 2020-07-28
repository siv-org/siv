import { Milestone } from './Milestone'
import styles from './protocol.module.css'
import { useScrollContext } from './scroll-context'
import { Step } from './Step'
import { steps } from './steps'

export const Content = () => (
  <div
    id="protocol"
    onScroll={saveScrollPosition(useScrollContext())}
    style={{
      backgroundColor: '#e5eafd',
      flex: 1,
      height: '100vh',
      overflowY: 'scroll',
      scrollBehavior: 'smooth',
    }}
  >
    {/* Header */}
    <div style={{ backgroundColor: 'white', padding: '10px 16px' }}>
      <p style={{ fontSize: 21, fontWeight: 700, marginBottom: 0 }}>Secure Internet Voting (SIV) Protocol Overview</p>
      <p style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>Fast, Private, Verifiable</p>
      <p className={styles.p}>Voting Method with mathematically provable privacy &amp; vote verifiability.</p>
    </div>

    {/* Main steps */}
    {steps.map((item) => (typeof item === 'string' ? Milestone(item) : Step(item)))}

    {/* Fin */}
    <div style={{ textAlign: 'center' }}>
      <img src={`./protocol/step-fin.png`} style={{ maxWidth: 600, width: '100%' }} />
    </div>

    <style jsx>{`
      /* Add padding when Topbar is visible */
      @media (max-width: 1030px) {
        #protocol {
          padding-top: 40px;
        }
      }
    `}</style>
  </div>
)

function saveScrollPosition({ dispatch, state }: ReturnType<typeof useScrollContext>) {
  return ({ currentTarget }: { currentTarget: HTMLElement }) => {
    const scrollPos = currentTarget.scrollTop
    const { innerHeight } = window

    // Find currently scrolled to step
    let current = 'Voter Registration'
    for (const step in state) {
      const yOffset = state[step]

      // Is screen's vertical midpoint past the step's start?
      if (scrollPos + innerHeight / 2 >= Number(yOffset)) {
        current = step
      }
    }

    if (current !== state.current) {
      dispatch({ current })
    }
  }
}
