import { TailwindPreflight } from 'src/TailwindPreflight'

function TestEmbedPage() {
  return (
    <>
      <div className="min-h-screen p-4 bg-blue-100">
        <main className="max-w-2xl mx-auto ">
          <h1 className="text-4xl font-bold">Hello from TestEmbedPage</h1>

          <iframe
            className="w-full h-[60rem] mt-10 bg-white border-2 border-solid border-black/30 rounded"
            src="https://siv.org/election/1720354276834/vote?auth=link&embed=https://vote.newamericanprimary.org"
          />
        </main>
      </div>
      <TailwindPreflight />
    </>
  )
}

export default TestEmbedPage
