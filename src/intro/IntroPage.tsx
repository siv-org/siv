import { TailwindPreflight } from 'src/TailwindPreflight'

import { Links } from './Links'

export const IntroPage = () => {
  return (
    <main className="max-w-[22rem] p-3 py-6 mx-auto text-center">
      {/* Header */}
      <h1 className="text-4xl font-bold text-blue-950">SIV</h1>
      <h2 className="text-2xl">Secure Internet Voting</h2>

      {/* 1-2-3 Graphic */}
      <ol className="flex mt-10 space-between">
        {['One Person, One Vote', 'Vote in Seconds', 'Cryptographic Privacy'].map((text, index) => (
          <li className="relative text-center" key={text}>
            <div className="w-5 h-5 mx-auto mb-1 text-sm text-white bg-blue-900 rounded-full">{index + 1}</div>
            {text}
          </li>
        ))}
      </ol>
      <div className="mt-5 mb-9">
        <div>✅</div>
        <div className="font-extrabold text-blue-900">Voter Verifiable Results</div>
      </div>

      {/* Links */}
      <Links />

      {/* Footer */}
      <div className="mt-6 opacity-50">© 2024 SIV, Inc.</div>

      <TailwindPreflight />
    </main>
  )
}
