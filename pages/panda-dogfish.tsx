import Router from 'next/router'
import { useEffect } from 'react'

import { api } from '../src/api-helper'

// Redirect to root url
export default function PandaDogfish() {
  useEffect(() => {
    api('pushover', { message: "Who's hitting that deprecated URL?", title: 'Panda-dogfish visit' })
    Router.push('/')
  })

  return <div />
}

// Here for backwards compability.
// Safe to remove me after Sept 1, 2020
