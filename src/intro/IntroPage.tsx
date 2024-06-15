import { TailwindPreflight } from 'src/TailwindPreflight'

import { Links } from './Links'
import { OneTwoThreeGraphic } from './OneTwoThreeGraphic'

export const IntroPage = () => {
  return (
    <main className="max-w-[22rem] min-h-screen p-3 py-6 mx-auto text-center flex flex-col">
      <section className="flex-grow">
        {/* Header */}
        <header>
          <h1 className="text-4xl font-bold text-blue-950">SIV</h1>
          <h2 className="text-2xl">Secure Internet Voting</h2>
        </header>

        <OneTwoThreeGraphic />
        <Links />
      </section>

      {/* Footer */}
      <footer className="mt-6 text-sm opacity-50">© 2024 SIV, Inc.</footer>

      <TailwindPreflight />
    </main>
  )
}
