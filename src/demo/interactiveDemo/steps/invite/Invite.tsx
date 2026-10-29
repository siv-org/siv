import { ArrowRight, Camera, IdCard, KeyRound, Mail, MessageSquare, PenLine, Send, UserRound } from 'lucide-react'
import { CSSProperties, useState } from 'react'

import { PrimaryButton } from '../../shared/PrimaryButton'
import { DigitalGovernmentID } from './DigitalGovernmentID'
import { EmailInvitation } from './EmailInvitation'
import { ExistingCredentials } from './ExistingCredentials'
import { InPersonInvitation } from './InPersonInvitation'
import { PhotoIDSelfie } from './PhotoIDSelfie'
import { PostalLetter } from './PostalLetter'
import { SignatureVerification } from './SignatureVerification'
import { TextMessage } from './TextMessage'

const options = [
  {
    description:
      'For elections that already offer vote-by-mail, administrators can include a unique Voter Code with each mailed ballot, giving voters an additional option to cast their ballot online through SIV.',
    icon: Mail,
    id: 'post',
    label: 'Postal Mail',
    preview: PostalLetter,
  },
  {
    description:
      'If administrators already have voters’ email addresses, they can email each voter a personal link to access their ballot.',
    icon: Send,
    id: 'email',
    label: 'Email',
    preview: EmailInvitation,
  },
  {
    description:
      'If administrators already have voters’ mobile phone numbers, they can text each voter a personal link to access their ballot.',
    icon: MessageSquare,
    id: 'sms',
    label: 'Text Message',
    preview: TextMessage,
  },
  {
    description:
      'For in-person voting events such as conventions, eligible voters can be given a unique QR code at check-in, and then later scan it to access their ballot.',
    icon: UserRound,
    id: 'person',
    label: 'In Person',
    preview: InPersonInvitation,
  },
  {
    description:
      'If voters have already been issued digital IDs, such as US Military CACs or European Smart IDs, these can be used to sign-in.',
    icon: IdCard,
    id: 'digital',
    label: 'Digital ID',
    preview: DigitalGovernmentID,
  },
  {
    icon: KeyRound,
    id: 'login',
    label: 'Existing Login Credentials',
    preview: ExistingCredentials,
  },
  {
    description: 'An identity-verification process compares your government-issued photo ID and selfie.',
    icon: Camera,
    id: 'photo',
    label: 'Photo ID + Selfie',
    preview: PhotoIDSelfie,
  },
  {
    description: 'Your signature is checked against the signature on your voter registration record.',
    icon: PenLine,
    id: 'signature',
    label: 'Signature Verification',
    preview: SignatureVerification,
  },
]

export function Invite({
  auth,
  onContinue,
  voteLink,
  voterNumber,
}: {
  auth: string
  onContinue: () => void
  voteLink: string
  voterNumber?: number
}) {
  const [selected, setSelected] = useState<null | string>(null)
  const selectedIndex = options.findIndex(({ id }) => id === selected)
  const option = options[selectedIndex]
  const Preview = option?.preview

  return (
    <div>
      <div aria-label="Ways to access your ballot" className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {options.map(({ icon: OptionIcon, id, label }, index) => (
          <button
            aria-controls="invitation-preview"
            aria-expanded={selected === id}
            aria-pressed={selected === id}
            className={`flex min-h-[64px] items-center gap-3 rounded-xl border px-3 py-3 text-left text-[0.78rem] leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h26-green sm:px-4 sm:text-[0.82rem] ${
              selected === id
                ? 'border-h26-green/40 bg-h26-green/[0.08] text-h26-green'
                : 'border-black/[0.08] bg-white/70 text-h26-textSecondary hover:border-h26-green/25 hover:bg-white'
            }`}
            key={id}
            onClick={() => setSelected(selected === id ? null : id)}
            style={{ order: index * 2 }}
            type="button"
          >
            <OptionIcon aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
            <span>{label}</span>
          </button>
        ))}
        {option && (
          <section
            aria-label={`${option.label} example`}
            aria-live="polite"
            className="col-span-full min-w-0 overflow-hidden rounded-2xl border border-black/[0.06] bg-white/60 order-[var(--preview-order)] sm:order-[var(--preview-order-sm)]"
            id="invitation-preview"
            // Match the grid breakpoint to position the preview below its selected row.
            style={
              {
                '--preview-order': Math.floor(selectedIndex / 2) * 4 + 3,
                '--preview-order-sm': Math.floor(selectedIndex / 3) * 6 + 5,
              } as CSSProperties
            }
          >
            {option.description && (
              <div className="border-b border-black/[0.06] px-5 py-4 sm:px-6">
                <p className="font-mono26 text-[9px] uppercase tracking-[0.15em] text-h26-muted">
                  {selected === 'email' || selected === 'signature' ? 'SIV interface' : 'Illustrative example'}
                </p>
                <p className="mt-1 text-[0.78rem] leading-relaxed text-h26-textSecondary">{option.description}</p>
              </div>
            )}
            {Preview && (
              <Preview auth={auth} onContinue={onContinue} voteLink={auth ? voteLink : ''} voterNumber={voterNumber} />
            )}
          </section>
        )}
      </div>
      <p className="mt-3 text-[0.75rem] leading-relaxed text-h26-muted">
        Methods can be combined to meet your election’s requirements.
      </p>
      <div className="mt-6 flex justify-end border-t border-black/[0.07] pt-5">
        <PrimaryButton disabled={!auth} onClick={onContinue}>
          Open ballot <ArrowRight aria-hidden className="ml-2 size-4" />
        </PrimaryButton>
      </div>
    </div>
  )
}
