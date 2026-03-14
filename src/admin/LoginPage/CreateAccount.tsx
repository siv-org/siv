import { validate as validateEmail } from 'email-validator'
import router from 'next/router'
import { useEffect, useState } from 'react'
import { NoSsr } from 'src/_shared/NoSsr'
import { api } from 'src/api-helper'

import { CreatedAccountWaiting } from './CreatedAccountWaiting'

const adminInitKey = 'siv-admin-init'

export const CreateAccount = () => {
  const [submitted, setSubmitted] = useState<string>()

  useEffect(() => {
    attemptInitLoginCode()
  }, [])

  if (submitted) return <CreatedAccountWaiting email={submitted} />

  return (
    <section className="px-6 py-6 rounded-xl border shadow-sm border-h26-border bg-white/60">
      <h2 className="font-serif26 text-[1.35rem] font-normal tracking-tight text-h26-text">Create an account</h2>
      <p className="mt-2 text-[0.88rem] text-h26-textSecondary">Approved governments can pilot SIV for free.</p>
      <NoSsr>
        <form
          className="grid gap-4 mt-5"
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.currentTarget
            const fields: Record<string, string> = {
              created_at: new Date().toString(),
              email: (form.querySelector('[name="email"]') as HTMLInputElement)?.value ?? '',
              first_name: (form.querySelector('[name="first_name"]') as HTMLInputElement)?.value ?? '',
              last_name: (form.querySelector('[name="last_name"]') as HTMLInputElement)?.value ?? '',
              your_organization: (form.querySelector('[name="your_organization"]') as HTMLInputElement)?.value ?? '',
            }
            const { email } = fields
            if (!validateEmail(email)) {
              alert('Not a valid email address')
              return
            }
            api('admin-create-account', fields).then(async (response) => {
              if (response.status !== 200) {
                alert((await response.json()).error)
                return
              }
              const data = await response.json()
              const code = data.init_login_code
              localStorage.setItem(adminInitKey, JSON.stringify({ code, email }))
              setSubmitted(email)
            })
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[0.75rem] font-medium uppercase tracking-wider text-h26-muted">
                First name
              </span>
              <input
                className="w-full rounded-lg border border-h26-border bg-white px-3 py-2.5 text-[0.95rem] text-h26-text outline-none focus:border-h26-green focus:ring-1 focus:ring-h26-green/30"
                name="first_name"
                type="text"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[0.75rem] font-medium uppercase tracking-wider text-h26-muted">
                Last name
              </span>
              <input
                className="w-full rounded-lg border border-h26-border bg-white px-3 py-2.5 text-[0.95rem] text-h26-text outline-none focus:border-h26-green focus:ring-1 focus:ring-h26-green/30"
                name="last_name"
                type="text"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-[0.75rem] font-medium uppercase tracking-wider text-h26-muted">Email</span>
            <input
              className="w-full rounded-lg border border-h26-border bg-white px-3 py-2.5 text-[0.95rem] text-h26-text outline-none focus:border-h26-green focus:ring-1 focus:ring-h26-green/30"
              name="email"
              type="email"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[0.75rem] font-medium uppercase tracking-wider text-h26-muted">
              Your organization
            </span>
            <input
              className="w-full rounded-lg border border-h26-border bg-white px-3 py-2.5 text-[0.95rem] text-h26-text outline-none focus:border-h26-green focus:ring-1 focus:ring-h26-green/30"
              name="your_organization"
              type="text"
            />
          </label>
          <div className="flex justify-end pt-1">
            <button
              className="rounded-full px-6 py-2.5 text-[0.9rem] font-medium shadow-h26-cta transition-all duration-200 hover:-translate-y-0.5 hover:shadow-h26-cta-hover"
              style={{ backgroundColor: '#1a6b4a', color: '#fff' }}
              type="submit"
            >
              Create account
            </button>
          </div>
        </form>
      </NoSsr>
    </section>
  )
}

export async function attemptInitLoginCode() {
  const initCode = localStorage.getItem(adminInitKey)
  if (!initCode) return
  const response = await api('admin-use-init-code', JSON.parse(initCode))

  if (response.status === 400) return console.error(await response.json())
  if (response.status === 204) return

  localStorage.removeItem(adminInitKey)
  if (response.status === 200) await router.push('./admin')
}
