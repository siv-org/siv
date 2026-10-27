import { useRouter } from 'next/router'
import { sharedDemoMethod } from 'src/demo/interactiveDemo/content'

export const Footer = () => {
  const { demo, election_id } = useRouter().query
  if (demo === '1' && typeof election_id === 'string' && sharedDemoMethod(election_id)) return null

  return (
    <p className="text-[11px] font-bold my-12 text-center">
      This vote is powered by{' '}
      <a className="text-blue-600 hover:underline" href="https://siv.org" rel="noreferrer" target="_blank">
        SIV.org
      </a>
    </p>
  )
}
