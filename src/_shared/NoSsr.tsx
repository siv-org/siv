import { ReactNode, useEffect, useState } from 'react'

interface NoSSRProps {
  /** The content to render on client. */
  children?: ReactNode
  /** Optional content to show before the component renders on client. This renders during server-side rendering (SSR). */
  onSSR?: React.FC
}

const EmptySpan = () => <span />

export const NoSsr = (props: NoSSRProps) => {
  const { children = <EmptySpan />, onSSR = EmptySpan } = props

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  })

  return isMounted ? <>{children}</> : onSSR({})
}
