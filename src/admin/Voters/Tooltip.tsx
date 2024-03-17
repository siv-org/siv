import React, { Fragment, ReactElement, ReactNode, cloneElement, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

type Placement = 'top' | 'bottom' | 'left' | 'right'
interface TooltipProps {
  children: ReactElement
  className?: string
  enterDelay?: number
  leaveDelay?: number
  placement?: Placement
  tooltip: string | ReactNode | (({ setIsShown }: { setIsShown: (setting: boolean) => void }) => ReactNode)
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
  const closeTimeoutId = useRef<NodeJS.Timeout | null>(null)

  // Calc position whenever shown
  useEffect(() => {
    if (isShown) updateTooltipPosition()
  }, [isShown, placement])

  function onMouseEnter() {
    closeTimeoutId.current && clearTimeout(closeTimeoutId.current)
    setTimeout(() => setIsShown(true), enterDelay)
  }
  function onMouseLeave() {
    // Setup a delay for leaving, but allow cancellation if re-entering
    closeTimeoutId.current = setTimeout(() => {
      setIsShown(false)
    }, leaveDelay)
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
      {tooltip && isShown
        ? ReactDOM.createPortal(
            <div
              className={`bg-white/90 rounded p-1 fixed z-50 ${className}`}
              ref={tooltipRef}
              {...{ onMouseEnter, onMouseLeave }}
              style={{
                border: '1px solid #ccc',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4)',
                left: tooltipPos.left,
                top: tooltipPos.top,
              }}
            >
              {typeof tooltip === 'function' ? tooltip({ setIsShown }) : tooltip}
            </div>,
            document.body,
          )
        : null}
    </Fragment>
  )
}

function calculatePosition(
  { height, left, top, width }: { height: number; left: number; top: number; width: number },
  { height: tooltipHeight, width: tooltipWidth }: { height: number; width: number },
  placement: Placement,
) {
  const margin = 10

  switch (placement) {
    case 'top':
      return { left: left + (width - tooltipWidth) / 2, top: top - tooltipHeight - margin }
    case 'bottom':
      return { left: left + (width - tooltipWidth) / 2, top: top + height }
    case 'left':
      return { left: left - tooltipWidth, top: top + (height - tooltipHeight) / 2 }
    case 'right':
      return { left: left + width, top: top + (height - tooltipHeight) / 2 }
    default:
      return { left: left, top: top }
  }
}
