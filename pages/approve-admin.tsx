import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from 'src/api-helper'

export default function ApproveAdminPage() {
  const { id, skip_init_email_validation } = useRouter().query

  useEffect(() => {
    if (!id) return
    // Approve admin on first load
    api('approve-admin', { id, skip_init_email_validation })
  }, [id, skip_init_email_validation])

  return (
    <main>
      <Head>
        <title>Approving Admin</title>
      </Head>
      <p>
        <b>applied-admin ID:</b> {id}
      </p>
      <style jsx>{`
        main {
          padding: 2rem;
          text-align: center;
        }
      `}</style>
    </main>
  )
}
