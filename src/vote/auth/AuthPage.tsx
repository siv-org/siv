import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'

import { Footer } from '../Footer'
import { VoterRegistrationForm } from '../VoterRegistrationForm'

export const AuthPage = () => {
  return (
    <>
      <Head title="Election Auth" />
      <main className="max-w-[750px] w-full mx-auto p-4 flex flex-col min-h-screen justify-between">
        <div>
          <h1 className="text-3xl font-bold">Voter Authentication</h1>
          <p>Your vote is now pending.</p>
          <VoterRegistrationForm />
        </div>
        <Footer />
      </main>
      <TailwindPreflight />
    </>
  )
}
