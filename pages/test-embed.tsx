import { useEffect } from 'react'
import { TailwindPreflight } from 'src/TailwindPreflight'

function TestEmbedPage() {
  useEffect(() => {
    const listenForIframeMessage = (event: MessageEvent) => console.log('incoming iframe message', event)

    window.addEventListener('message', listenForIframeMessage)
    console.log('Registered listenForIframeMessage()')
    return () => window.removeEventListener('message', listenForIframeMessage)
  }, [])

  return (
    <>
      <div className="min-h-screen p-4 bg-blue-100">
        <main className="max-w-2xl mx-auto ">
          <h1 className="text-4xl font-bold">Hello from TestEmbedPage</h1>

          <iframe
            className="w-full h-[60rem] mt-10 bg-white border-2 border-solid border-black/30 rounded"
            src="http://localhost:3000/election/1720354276834/vote?auth=link&embed=http://localhost:3000"
          />
        </main>
      </div>
      <TailwindPreflight />
    </>
  )
}

export default TestEmbedPage
