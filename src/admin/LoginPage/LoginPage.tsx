import 'tailwindcss/tailwind.css'

import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'

const supabaseUrl = 'https://ktoemmjtpzoqhunxvabf.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMjg0ODgxMiwiZXhwIjoxOTI4NDI0ODEyfQ.CGcmI1V3Wwm9JdQtalhatkLNODRw9mTRJLf-m3sra_w'
const supabase = createClient(supabaseUrl, SUPABASE_KEY)

export const LoginPage = () => {
  const [email, setEmail] = useState('')

  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">Sign in to your account</h2>

        <div className="mt-8 space-y-6">
          <div className="-space-y-px rounded-md shadow-sm">
            <label className="sr-only" htmlFor="email-address">
              Email address
            </label>
            <input
              required
              autoComplete="email"
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
              id="email-address"
              name="email"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <p className="text-xs italic text-gray-400">You will be emailed a login link.</p>

          <div>
            <button
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={async () => {
                const response = await supabase.auth.signIn({ email })

                console.log('response', response)
              }}
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                {/* Heroicon name: solid/lock-closed */}
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    fillRule="evenodd"
                  />
                </svg>
              </span>
              Sign in
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
