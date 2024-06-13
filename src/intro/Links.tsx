import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

type Text = string
type Href = string | false
type CustomClasses = string
const linkArray: [Text, Href?, CustomClasses?][] = [
  ['Demo — How SIV Works', false, 'border-green-800 bg-green-200'],
  ['Bring to my area', false, 'border-orange-800 bg-orange-200'],
  ['Create Own SIV Election', false, 'border-blue-800 bg-blue-200'],
  ['Questions? FAQ', false, 'border-gray-400 bg-gray-200'],
  [
    'Earn up to $10,000 for finding Security Flaws',
    false,
    'border-purple-800 text-purple-700 bg-purple-100 bg-opacity-0',
  ],
  ['Compare vs Paper', false, 'border-amber-800 bg-amber-800 bg-opacity-10 hover:bg-opacity-20 active:bg-opacity-30'],
  ['Contribute', false, 'border-pink-800 bg-pink-200'],
  ['Blog', false, 'border-gray-600 bg-gray-50 hover:bg-gray-100 active:bg-gray-200/80'],
  ['Technical Documentation'],
  ['CS Research Powering SIV'],
  ['Spoiler-Free Voting Methods'],
  ['Preventing Future Authoritarianism'],
  ['Use in War Zones'],
  ['Malware-Resistant Verification'],
]

export const Links = () => {
  return (
    <>
      {linkArray.map(([text, href, customClasses = 'border-gray-300 hover:bg-gray-100 active:bg-gray-200/80']) => (
        <SingleLink key={text} {...{ customClasses, href, text }} />
      ))}
    </>
  )
}

const SingleLink = ({ customClasses, href, text }: { customClasses: CustomClasses; href?: Href; text: Text }) => {
  const [showComingSoon, setShowComingSoon] = useState(false)
  return (
    <>
      <a
        className={twMerge(
          'block p-2 mb-2 border rounded-lg font-medium bg-opacity-50 hover:bg-opacity-70 active:bg-opacity-100 cursor-pointer',
          customClasses,
        )}
        target="_blank"
        onClick={() => {
          if (href) return
          setShowComingSoon(!showComingSoon)
        }}
      >
        {text}
      </a>
      {showComingSoon && <div className="mb-4 italic opacity-50">Coming Soon</div>}
    </>
  )
}
