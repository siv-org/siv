import { SafetyOutlined } from '@ant-design/icons'

export const AntiCoercionReminder = () => {
  return (
    <details className="mt-4 -ml-2 rounded-lg open:bg-gray-100 group">
      <summary className="p-2 font-medium rounded-lg cursor-pointer sm:pr-4 hover:bg-gray-200 w-fit group-open:w-full">
        <SafetyOutlined className="mr-1.5 text-lg text-green-800 relative top-px" />
        Reminder: Your vote is your private choice
      </summary>
      <div className="p-2 space-y-1 text-sm text-black/50">
        <p>For elections to be truly Free and Fair, every voter must be able to make their own honest choices.</p>
        <p>
          If anyone is pressuring you to prove you voted a certain way, SIV has{' '}
          <Link href="/overrides">advanced tools</Link> available to help.
        </p>
        <p>
          Please contact your election administrator or <Link href="mailto:help@siv.org">help@siv.org</Link>.
        </p>
      </div>
    </details>
  )
}

function Link({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a className="text-blue-500 hover:underline" href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  )
}
