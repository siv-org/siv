import { YouLabel } from './YouLabel'

export const Attendees = () => (
  <>
    <h3>I. Attendees:</h3>
    <ol>
      <li>admin@secureinternetvoting.org</li>
      <li>
        trustee_1@gmail.com <YouLabel />
      </li>
      <li>other_trustee@yahoo.com</li>
    </ol>
    <Awaiting />
  </>
)

const Awaiting = () => {
  const awaiting = ['invited1', 'invited2', 'invited3']
  awaiting.shift()
  awaiting.pop()
  awaiting.pop()

  if (!awaiting.length) {
    return <p>Everyone&apos;s arrived. 👍</p>
  }

  return (
    <>
      <h3>Awaiting:</h3>
      <ol>
        {awaiting.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ol>
    </>
  )
}
