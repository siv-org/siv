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

  const publicKey = privateKey ? G.multiply(BigInt(`${privateKey}`)).toHex() : ''

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
          <input
            className="p-2 w-full rounded-md border border-gray-300"
            onChange={(event) => setPrivateKey(event.target.value)}
            placeholder="96244...471"
            type="text"
            value={privateKey}
          />

          <label className="block mt-4 text-sm">Resulting Public Key</label>
          <div className="p-2 h-8 rounded-md border border-gray-300">{publicKey}</div>
          <div>{}</div>
        </div>

        <p className="mt-8 font-bold">Definitions</p>
        <p>
          G = the {'"'}base point{'"'} of Ristretto255
        </p>
        <p>
          <Link href="https://ristretto.group">Ristretto255</Link> = the specific elliptic curve SIV uses (same as
          Signal)
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
