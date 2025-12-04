import { useStored } from '../useStored'

export const CustomEmailHeaderbar = () => {
  const { custom_email_headerbar } = useStored()

  if (!custom_email_headerbar) return null
  return (
    <div
      className="p-2 rounded-md cursor-pointer bg-black/5 hover:bg-black/10"
      onClick={() => alert('Contact team@siv.org to change')}
    >
      <i>Custom Email Headerbar:</i> {custom_email_headerbar}
    </div>
  )
}
