export const PDF = () => {
  return (
    <object
      data={`${window.location.origin}/sample-ballot.pdf`}
      style={{ height: 500, maxWidth: 500, width: '100%' }}
    />
  )
}
