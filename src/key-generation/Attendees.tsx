export const Attendees = () => (
  <>
    <h3>Attendees:</h3>
    <ol>
      <li>admin@secureinternetvoting.org</li>
      <li>trustee_1@gmail.com [YOU]</li>
      <li>cool_trustee@yahoo.com</li>
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
    return <h4>Everyone&apos;s arrived. 👍</h4>
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
