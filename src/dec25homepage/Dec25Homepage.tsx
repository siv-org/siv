import { Head } from 'src/Head'
import { Footer } from 'src/homepage/Footer'
import { TailwindPreflight } from 'src/TailwindPreflight'

import { CreateAVote } from './CreateAVote'
import { HowDoesItWork } from './HowDoesItWork'
// import { WhoShouldBeNext } from './WhosNext'

export function Dec25HomepageIdea() {
  return (
    <>
      <Head title="Dec 25 Homepage" />
      <main className="flex flex-col gap-12 items-center p-6">
        {/* Header */}
        <div>
          <h2 className="text-[13px] font-medium text-right float-right pt-1">
            <a
              className="font-bold hover:text-blue-900 text-black/40"
              href="https://siv.org"
              rel="noreferrer"
              target="_blank"
            >
              SIV.org
            </a>
          </h2>
          <h3>Create a</h3>
          <h1 className="text-4xl font-bold">Private Verifiable Vote</h1>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 items-center w-full">
          <CreateAVote />
          <HowDoesItWork />
        </div>

        {/* Stats */}
        <div className="space-y-1 text-center">
          <h4>75,000 voters</h4>
          <h4>35,000 votes cast</h4>
          <h4>in 12 countries</h4>

          <p className="!mt-4 text-xs italic text-gray-400">So far</p>

          {/* <WhoShouldBeNext /> */}
        </div>
      </main>

      <div className="h-screen" />
      <div className="px-4">
        <Footer />
      </div>
      <TailwindPreflight />
    </>
  )
}
