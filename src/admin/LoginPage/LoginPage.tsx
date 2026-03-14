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
          <div className="mx-auto max-w-[600px] animate-[fadeInUp_0.8s_ease-out_both]">
            <h1 className="font-serif26 text-[clamp(1.75rem,4vw,2.4rem)] font-normal tracking-tight text-center">
              Log in to run your vote
            </h1>
            <p className="mt-3 text-center text-[0.9rem] leading-[1.6] text-h26-textSecondary">
              Enter your email and we’ll send you a one-time code. No password required.
            </p>

            <LoginFormSection />

            <p className="my-8 text-center text-[0.85rem] italic text-h26-muted">— or —</p>

            <CreateAccount />
          </div>

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
