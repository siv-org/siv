import { TailwindPreflight } from 'src/TailwindPreflight'

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
      {[
        ['Demo — How SIV Works', 'border-green-800 bg-green-200'],
        ['Bring to my area', 'border-orange-800 bg-orange-200'],
        ['Create Own SIV Election', 'border-blue-800 bg-blue-200'],
        ['Questions? FAQ', 'border-gray-400 bg-gray-200'],
        [
          'Earn up to $10,000 for finding Security Flaws',
          'border-purple-800 text-purple-700 bg-purple-100 bg-opacity-0',
        ],
        ['Compare vs Paper', 'border-amber-800 bg-amber-800 bg-opacity-10 hover:bg-opacity-20 active:bg-opacity-30'],
        ['Contribute', 'border-pink-800 bg-pink-200'],
        ['Blog', 'border-gray-600 bg-gray-50 hover:bg-gray-100 active:bg-gray-200/80'],
        ['Technical Documentation'],
        ['CS Research Powering SIV'],
        ['Spoiler-Free Voting Methods'],
        ['Preventing Future Authoritarianism'],
        ['Use in War Zones'],
        ['Malware-Resistant Verification'],
      ].map(([text, customClasses = 'border-gray-300 hover:bg-gray-100 active:bg-gray-200/80']) => (
        <a
          className={`block p-2 mb-2 border rounded-lg font-medium bg-opacity-50 hover:bg-opacity-70 active:bg-opacity-100 cursor-pointer ${customClasses}`}
          key={text}
        >
          {text}
        </a>
      ))}

      {/* Footer */}
      <div className="mt-6 opacity-50">© 2024 SIV, Inc.</div>

      <TailwindPreflight />
    </main>
  )
}
