import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GlobalCSS } from 'src/GlobalCSS'

import { Head } from '../../Head'
import { useUser } from '../auth'
import { AboutSection } from './AboutSection'
import { CreateAccount } from './CreateAccount'
import { Headerbar } from './Headerbar'
import { MobileLogin } from './MobileLogin'

export const breakpoint = 500

export const LoginPage = () => {
  useLoggedOutOnly()

  return (
    <main>
      <Head title="Admin Login" />
      <Headerbar />
      <div className="flex justify-center px-[3vw]">
        <div className="columns">
          <AboutSection />
          <div className="spacer" />
          <MobileLogin />
          <CreateAccount />
        </div>
      </div>
      <style jsx>{`
        .columns {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: max(calc(100vh - 68px), 620px);

          flex: 1;
          max-width: 1000px;
        }

        .spacer {
          width: 15px;
        }

        @media (max-width: ${breakpoint}px) {
          .columns {
            flex-direction: column;
            max-width: 322px;
          }
        }
      `}</style>
      <style global jsx>{`
        body {
          background: #f9fafb;
        }
      `}</style>
      <GlobalCSS />
    </main>
  )
}

function useLoggedOutOnly() {
  const { loading, loggedOut } = useUser()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (!loading && !loggedOut && !redirecting) {
      setRedirecting(true)
      router.push('./admin')
    }
  }, [loading, loggedOut])
}
