import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'

import { Footer } from '../Footer'
import { VoterAuthInfoForm } from './VoterAuthInfoForm'

export const AuthPage = () => {
  return (
    <>
      <Head title="Election Auth" />
      <main className="max-w-[750px] w-full mx-auto p-4 flex flex-col min-h-screen justify-between">
        <section>
          <h1 className="mt-8 text-3xl font-bold">Voter Authentication</h1>

          <div className="mt-3 mb-6 text-lg">
            <p className="mb-3 italic opacity-60">Your vote is now pending.</p>
            <p>Please provide your identifying information.</p>
            <p className="text-sm opacity-50">Your vote selections remain private.</p>
          </div>
          <VoterAuthInfoForm />
        </section>
        <Footer />
      </main>
      <TailwindPreflight />
    </>
  )
}
