import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { Content } from './Content'
import { ScrollContextProvider } from './ScrollContext'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { VoteContextProvider } from './VoteContext'

export const ProtocolPage = (): JSX.Element => (
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
