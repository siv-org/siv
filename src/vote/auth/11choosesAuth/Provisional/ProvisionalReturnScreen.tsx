import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { OnClickButton } from 'src/_shared/Button'
import { clearProvisionalLinkAuth, getProvisionalLinkAuth } from './provisionalStorage'

export const ProvisionalReturnScreen = ({ election_id }: { election_id: string }) => {
  const router = useRouter()
  const [linkAuth, setLinkAuth] = useState<string | null>(null)

  useEffect(() => {
    if (!election_id) return
    const stored = getProvisionalLinkAuth(election_id)
    setLinkAuth(stored?.link_auth || null)
  }, [election_id])

  const hasExisting = !!linkAuth

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4">
      <div className="w-full rounded-2xl border border-purple-100 bg-white/90 p-8 shadow-lg">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          It looks like you already submitted a Provisional ballot from this browser.
        </h1>

        <p className="mt-6 text-center text-lg leading-relaxed text-slate-700">
          You can continue with your current provisional ballot, or start a new one.
        </p>

        {!hasExisting && (
          <p className="mt-4 text-center text-sm text-red-500">
            We couldn&apos;t find a saved provisional ballot for this browser. You can still start a new one.
          </p>
        )}

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <OnClickButton
            className="w-full max-w-xs text-center text-lg"
            disabled={!hasExisting}
            onClick={() => {
              if (!linkAuth) return
              router.push(`/election/${election_id}/auth?link=${encodeURIComponent(linkAuth)}`)
            }}
          >
            Continue with current ballot
          </OnClickButton>

          <button
            className="w-full max-w-xs rounded-lg border border-slate-300 px-4 py-3 text-lg font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.localStorage.removeItem(`voter-${election_id}-link`)
              }
              clearProvisionalLinkAuth(election_id)
              router.reload()
            }}
            type="button"
          >
            Start a new provisional ballot
          </button>
        </div>
      </div>
    </div>
  )
}


