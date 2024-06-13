import { TailwindPreflight } from 'src/TailwindPreflight'

export const IntroPage = () => {
  return (
    <main className="max-w-sm p-3 mx-auto text-center">
      <h1 className="text-4xl font-bold text-blue-950">SIV</h1>
      <h2 className="text-2xl">Secure Internet Voting</h2>
      <ol className="flex mt-10 space-x-10 list-decimal">
        <li>One Person, One Vote</li>
        <li>Vote in Seconds</li>
        <li>Cryptographic Privacy</li>
      </ol>
      <div className="mt-7">
        <div>✅</div>
        <div>Voter Verifiable Results</div>
      </div>
      <TailwindPreflight />
    </main>
  )
}
