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
            <div className="w-5 h-5 mx-auto text-sm text-white bg-blue-900 rounded-full">{index + 1}</div>
            {text}
          </li>
        ))}
      </ol>
      <div className="my-7">
        <div>✅</div>
        <div className="font-extrabold text-blue-900">Voter Verifiable Results</div>
      </div>

      {/* Links */}
      {[
        'Demo — How SIV Works',
        'Bring to my area',
        'Create Own SIV Election',
        'Questions? FAQ',
        'Earn up to $10,000 for finding Security Flaws',
        'Compare vs Paper',
        'Contribute',
        'Blog',
        'Technical Documentation',
        'CS Research Powering SIV',
        'Spoiler-Free Voting Methods',
        'Preventing Future Authoritarianism',
        'Use in War Zones',
        'Malware-Resistant Verification',
      ].map((text) => (
        <a className="block p-2 mb-2 border rounded-lg" key={text}>
          {text}
        </a>
      ))}

      <TailwindPreflight />
    </main>
  )
}
