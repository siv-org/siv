import { useState } from 'react'
import { G } from 'src/crypto/curve'
import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'

function Link({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a className="text-blue-500 hover:underline" href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  )
}

function TestPrivateKeyPage() {
  const [privateKey, setPrivateKey] = useState('')

  let publicKey = ''
  try {
    if (privateKey.trim()) publicKey = G.multiply(BigInt(privateKey.trim())).toHex()
  } catch {
    publicKey = 'Invalid decimal key'
  }

  return (
    <main className="max-w-[750px] w-full mx-auto p-4 py-12 flex flex-col min-h-screen text-center">
      <Head title="Test Private Key" />
      <h1 className="text-3xl font-bold">Test a Private Key</h1>

      <div className="flex flex-col justify-center items-center mt-8">
        <p>Elliptic Curve Public Key = G.multiply(private_key)</p>

        <div className="mt-4 text-left">
          <label className="block text-sm" htmlFor="privateKey">
            Private Key
          </label>
          <textarea
            className="p-2 w-full h-24 rounded-md border border-gray-300"
            onChange={(event) => setPrivateKey(event.target.value)}
            placeholder="96244...471"
            value={privateKey}
          />

          <label className="block mt-4 text-sm">Resulting Public Key</label>
          <div className="p-2 min-h-[4rem] break-all rounded-md border border-gray-300">{publicKey}</div>
          <div>{}</div>
        </div>

        <p className="mt-8 font-bold">Definitions</p>
        <p>
          G = the {'"'}base point{'"'} of Curve25519
        </p>
        <p>
          <Link href="https://en.wikipedia.org/wiki/Curve25519">Curve25519</Link> = the specific elliptic curve SIV uses{' '}
          <span className="text-sm opacity-50">
            (<Link href="https://ristretto.group">Ristretto255</Link> subgroup)
          </span>
        </p>
        <p>
          multiply() ={' '}
          <Link href="https://en.wikipedia.org/wiki/Elliptic_curve_point_multiplication">
            Elliptic Curve Point Multiplication
          </Link>
          , a one-way function
        </p>
      </div>

      <TailwindPreflight />
    </main>
  )
}

export default TestPrivateKeyPage
