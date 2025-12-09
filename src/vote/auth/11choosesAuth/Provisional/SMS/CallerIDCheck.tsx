import { Spinner } from 'src/admin/Spinner'

export const CallerIDCheck = () => {
  return (
    <div className="pr-4 mt-4 text-sm animate-pulse text-black/70">
      <span className="relative bottom-0.5">
        <Spinner />
      </span>{' '}
      Checking caller ID...
    </div>
  )
}
