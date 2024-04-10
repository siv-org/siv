import Link from 'next/link'

export const CreateConvention = () => {
  return (
    <Link href="/admin/conventions">
      <div className="px-4 pb-2 -ml-4 transition border-2 border-transparent border-solid rounded-lg cursor-pointer hover:border-blue-900/50 mt-14">
        <h2>Your Conventions</h2>
        <p>Reusable voter credentials, for multiple ballots throughout a day.</p>
      </div>
    </Link>
  )
}
