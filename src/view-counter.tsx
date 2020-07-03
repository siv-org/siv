import { useDocument } from '@nandorojo/swr-firestore'
import { useState } from 'react'
import { firestore } from 'firebase'

type Pageviews = { views: number | firestore.FieldValue }

export default function ViewCounter(): JSX.Element {
  const { data, update, error } = useDocument<Pageviews>(`meta/pageviews`, { listen: true })
  const [incremented, setIncremented] = useState(false)

  if (error) console.error('error loading page views', error)

  if (data && !incremented) {
    update({ views: firestore.FieldValue.increment(1) })
    setIncremented(true)
  }

  return (
    <>
      <p>{data?.views} views</p>
      <style jsx>{`
        p {
          text-align: center;
          margin-top: 0;
          font-size: 13px;
          color: #555;
          ${!data && 'opacity: 0;'}
        }
      `}</style>
    </>
  )
}
