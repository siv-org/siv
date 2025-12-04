import { useRouter } from 'next/router'
import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'
import { Footer } from 'src/vote/Footer'

import { AddEmailPage } from '../AddEmailPage'

export const ProvisionalFlow = () => {
  const { election_id, link: link_auth } = useRouter().query as { election_id?: string; link?: string }

  if (!election_id) return <div className="animate-pulse">Loading Election ID...</div>

  return (
    <main className="max-w-[750px] w-full mx-auto p-4 flex flex-col min-h-screen justify-between text-center">
      <Head title="Provisional Ballot Auth" />

      <AddEmailPage auth="provisional" {...{ election_id, link_auth }} />

      <Footer />
      <TailwindPreflight />
    </main>
  )
}
