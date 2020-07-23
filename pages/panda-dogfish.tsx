import Router from 'next/router'
import { useEffect } from 'react'

// Redirect to root url
export default function PandaDogfish() {
  useEffect(() => {
    Router.push('/')
  })

  return <div />
}
