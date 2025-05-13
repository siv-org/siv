import { ElectionCompleted } from './ElectionCompleted'
import { Introduction } from './Introduction'
import { Milestone } from './Milestone'
import { useScrollContext } from './ScrollContext'
import { Step } from './Step'
import { stepHash } from './step-hash'
import { groupedSteps, initStep } from './steps'

export const Content = () => (
  <div
    id="protocol"
    onScroll={saveScrollPosition(useScrollContext())}
    style={{
      bottom: 0,
      left: 268,
      overflowY: 'scroll',
      position: 'absolute',
      right: 0,
      top: 0,
    }}
  >
    <Introduction />

    {/* Main steps */}
    {groupedSteps.map(({ group, steps }) => (
      <div key={group}>
        {Milestone(group)}
        {steps.map(Step)}
      </div>
    ))}

    <ElectionCompleted />

    <style jsx>{`
      /* Add padding when Topbar is visible */
      @media (max-width: 1030px) {
        #protocol {
          top: 45px !important;
          left: 0 !important;
        }
      }
    `}</style>
  </div>
)

function saveScrollPosition({ dispatch, state }: ReturnType<typeof useScrollContext>) {
  return ({ currentTarget }: { currentTarget: HTMLElement }) => {
    const scrollPos = currentTarget.scrollTop
    const { innerHeight, innerWidth } = window

    // Find currently scrolled to step
    let current = initStep
    for (const step in state) {
      const yOffset = state[step]

      // Did we scroll past the step?
      // For sidebar, count when it passes midpoint.
      // For topbar, when it crosses top.
      const adjustment = innerWidth < 1030 ? 0 : innerHeight / 2
      if (scrollPos + adjustment >= Number(yOffset)) {
        current = step
      }
    }

    if (current !== state.current) {
      dispatch({ current })
      history.replaceState(null, '', `#${stepHash[current]}`)
    }
  }
}
