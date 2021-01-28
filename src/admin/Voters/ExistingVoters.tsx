import { use_stored_info } from '../load-existing'

export const ExistingVoters = () => {
  const { voters } = use_stored_info()
  return (
    <>
      {voters?.map(([email, has_voted], index) => (
        <p key={email}>
          {index + 1}. {email} {has_voted ? '— Voted' : ''}
        </p>
      ))}
    </>
  )
}
