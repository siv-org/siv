import { useEffect, useState } from 'react'
import { useAnalytics } from 'src/useAnalytics'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { Content } from './Content'
import { ScrollContextProvider } from './ScrollContext'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { VoteContextProvider } from './VoteContext'

export const FwdElectionPlanPage = (): JSX.Element => {
  const [mounted, setMounted] = useState(false)
  useAnalytics()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <>
        <Head title="Protocol" />
        <GlobalCSS />
      </>
    )
  }

  return (
    <>
      <Head title="Protocol" />

      <VoteContextProvider>
        <ScrollContextProvider>
          <Topbar />
          <div className="columns">
            <Sidebar />
            <Content />
          </div>
        </ScrollContextProvider>
      </VoteContextProvider>

      <style jsx>{`
        .columns {
          display: flex;
        }
      `}</style>

      <GlobalCSS />
      <style global jsx>{`
        body {
          overflow: hidden;
        }
      `}</style>
    </>
  )
}
