import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { LoginFormSection } from 'src/admin/LoginPage/LoginFormSection'
import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'

import { h26fonts } from '../../homepage2026/fonts'
import { Footer } from '../../homepage2026/Footer'
import { Nav } from '../../homepage2026/Nav'
import { useUser } from '../auth'
import { CreateAccount } from './CreateAccount'
import { LoginProperties } from './LoginProperties'

export const breakpoint = 500

export const LoginPage = () => {
  useLoggedOutOnly()

  return (
    <div className={`overflow-x-hidden min-h-screen antialiased bg-h26-bg text-h26-text ${h26fonts}`}>
      <Head title="Admin Login" />
      <div className="relative z-10">
        <Nav />
        <main className="px-7 pt-[7rem] pb-6 md:pt-[8.5rem] md:pb-12">
          {/* Top row: login only */}
          <div className="mx-auto max-w-[600px] animate-[fadeInUp_0.8s_ease-out_both]">
            <h1 className="font-serif26 text-[clamp(1.75rem,4vw,2.4rem)] font-normal tracking-tight text-center">
              Log in to run your vote
            </h1>
            <p className="mt-3 text-center text-[0.9rem] leading-[1.6] text-h26-textSecondary">
              Enter your email and we’ll send you a one-time code. No password required.
            </p>
            <LoginFormSection />
          </div>

          {/* One section: "or create account" — phone + form in a single container */}
          <div className="mx-auto mt-14 md:mt-16 max-w-[640px] lg:max-w-[900px] animate-[fadeInUp_0.8s_ease-out_0.08s_both]">
            <p className="text-center text-[0.8rem] font-medium uppercase tracking-wider text-h26-muted mb-6">— or —</p>
            <div className="px-6 py-8 rounded-2xl border shadow-sm border-h26-border bg-white/50 lg:px-10 lg:py-10">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8 lg:items-center">
                <aside className="flex order-2 justify-center lg:order-1 lg:justify-start">
                  <img
                    alt="Vote on your phone"
                    className="w-[200px] max-w-[85%] object-contain"
                    src="/login/iphone.png"
                  />
                </aside>
                <div className="order-1 min-w-0 lg:order-2">
                  <CreateAccount />
                </div>
              </div>
            </div>
          </div>

          {/* What you get — clear next section */}
          <LoginProperties />
        </main>
        <Footer />
      </div>
      <TailwindPreflight />
    </div>
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
