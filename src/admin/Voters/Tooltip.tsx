import React, { cloneElement, Fragment, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'

type Placement = 'bottom' | 'left' | 'right' | 'top'
interface TooltipProps {
  children: ReactElement
  className?: string
  enterDelay?: number
  leaveDelay?: number
  placement?: Placement
  tooltip: (({ setIsShown }: { setIsShown: (setting: boolean) => void }) => ReactNode) | ReactNode | string
}

export const Tooltip = ({
  children,
  className = '',
  enterDelay = 0,
  leaveDelay = 50,
  placement = 'top',
  tooltip,
}: TooltipProps) => {
  const [isShown, setIsShown] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLElement>(null)
  const closeTimeoutId = useRef<null | number>(null)

  // Calc position whenever shown
  useEffect(() => {
    if (isShown) updateTooltipPosition()
  }, [isShown, placement])
  function onMouseEnter() {
    if (closeTimeoutId.current) clearTimeout(closeTimeoutId.current)
    setTimeout(() => setIsShown(true), enterDelay)
  }
  function onMouseLeave() {
    // Setup a delay for leaving, but allow cancellation if re-entering
    closeTimeoutId.current = setTimeout(() => {
      setIsShown(false)
    }, leaveDelay) as unknown as number
  }

  // Clone the child and inject props
  const child = cloneElement(children, {
    onMouseEnter,
    onMouseLeave,
    ref: targetRef,
  })

  function updateTooltipPosition() {
    if (!tooltipRef.current) return console.warn('Missing tooltip ref')
    if (!targetRef.current) return console.warn('Missing target ref')

    const targetRect = targetRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const newPosition = calculatePosition(targetRect, tooltipRect, placement)
    setTooltipPos(newPosition)
  }

  return (
    <Fragment>
      {child}

      {/* Tooltip element */}
      {tooltip &&
        ReactDOM.createPortal(
          <CSSTransition classNames="tooltip" in={isShown} timeout={10} unmountOnExit>
            <div
              className={`bg-white/90 rounded p-1 fixed z-50 max-w-xs ${className}`}
              ref={tooltipRef}
              {...{ onMouseEnter, onMouseLeave }}
              style={{
                border: '1px solid #ccc',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4)',
                hyphens: 'auto',
                left: tooltipPos.left,
                overflowWrap: 'break-word',
                top: tooltipPos.top,
                wordWrap: 'break-word',
              }}
            >
              {typeof tooltip === 'function' ? tooltip({ setIsShown }) : tooltip}
            </div>
          </CSSTransition>,
          document.body,
        )}

      {/* Transitions */}
      <style global jsx>{`
        .tooltip-enter,
        .tooltip-exit-active {
          opacity: 0;
          transform: translateY(7px);
        }

        .tooltip-enter-active,
        .tooltip-exit {
          opacity: 1;
          transform: translateY(0);
        }

        .tooltip-enter-active {
          transition: opacity 200ms, transform 100ms;
        }
      `}</style>
    </Fragment>
  )
}

function calculatePosition(
  { height, left, top, width }: { height: number; left: number; top: number; width: number },
  { height: tooltipHeight, width: tooltipWidth }: { height: number; width: number },
  placement: Placement,
) {
  const margin = 10
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Ensure tooltip doesn't go off-screen horizontally
  const maxLeft = viewportWidth - tooltipWidth - margin
  const minLeft = margin

  // Ensure tooltip doesn't go off-screen vertically
  const maxTop = viewportHeight - tooltipHeight - margin
  const minTop = margin

  let calculatedPosition: { left: number; top: number }

  switch (placement) {
    case 'bottom':
      calculatedPosition = { left: left + (width - tooltipWidth) / 2, top: top + height }
      break
    case 'left':
      calculatedPosition = { left: left - tooltipWidth, top: top + (height - tooltipHeight) / 2 }
      break
    case 'right':
      calculatedPosition = { left: left + width, top: top + (height - tooltipHeight) / 2 }
      break
    case 'top':
      calculatedPosition = { left: left + (width - tooltipWidth) / 2, top: top - tooltipHeight - margin }
      break
    default:
      calculatedPosition = { left: left, top: top }
  }

  // Clamp position to viewport bounds
  return {
    left: Math.max(minLeft, Math.min(maxLeft, calculatedPosition.left)),
    top: Math.max(minTop, Math.min(maxTop, calculatedPosition.top)),
  }
}
