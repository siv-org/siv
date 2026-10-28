import {
  ArrowRight,
  CreditCard,
  Fingerprint,
  Mail,
  MessageSquare,
  PenLine,
  Send,
  Smartphone,
  UserRound,
} from 'lucide-react'
import { CSSProperties, useState } from 'react'

import { PrimaryButton } from '../../shared/PrimaryButton'
import { CommonAccessCard } from './CommonAccessCard'
import { DigitalGovernmentID } from './DigitalGovernmentID'
import { EmailInvitation } from './EmailInvitation'
import { InPersonInvitation } from './InPersonInvitation'
import { PhotoIDSelfie } from './PhotoIDSelfie'
import { PostalLetter } from './PostalLetter'
import { SignatureVerification } from './SignatureVerification'
import { TextInvitation } from './TextInvitation'
import { TextMessageVerification } from './TextMessageVerification'

const options = [
  {
    description:
      'For elections that already offer vote-by-mail, administrators can include a unique Voter Code with each mailed ballot, giving voters an additional option to cast their ballot online through SIV.',
    icon: Mail,
    id: 'post',
    label: 'Postal mail',
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
    description: 'Your personal ballot link arrives at your registered phone number.',
    icon: MessageSquare,
    id: 'sms',
    label: 'Text message',
    preview: TextInvitation,
  },
  {
    description: 'Receive your personal Voter Code after an eligibility check in person.',
    icon: UserRound,
    id: 'person',
    label: 'In person',
    preview: InPersonInvitation,
  },
  {
    description: 'Sign in through a supported government identity service to access your assigned ballot.',
    icon: Fingerprint,
    id: 'digital',
    label: 'Digital government ID',
    preview: DigitalGovernmentID,
  },
  {
    description: 'Authenticate with your CAC through a supported integration to access your assigned ballot.',
    icon: CreditCard,
    id: 'cac',
    label: 'Common Access Card',
    preview: CommonAccessCard,
  },
  {
    description: 'An identity-verification process compares your government-issued photo ID and selfie.',
    icon: UserRound,
    id: 'photo',
    label: 'Photo ID + selfie',
    preview: PhotoIDSelfie,
  },
  {
    description: 'Your signature is checked against the signature on your voter registration record.',
    icon: PenLine,
    id: 'signature',
    label: 'Signature verification',
    preview: SignatureVerification,
  },
  {
    description: 'Confirm access with a one-time code sent to your registered phone number.',
    icon: Smartphone,
    id: 'sms-check',
    label: 'Text message verification code',
    preview: TextMessageVerification,
  },
]

export function Invite({ auth, onContinue, voteLink }: { auth: string; onContinue: () => void; voteLink: string }) {
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
            <div className="border-b border-black/[0.06] px-5 py-4 sm:px-6">
              <p className="font-mono26 text-[9px] uppercase tracking-[0.15em] text-h26-muted">
                {selected === 'email' || selected === 'signature' ? 'SIV interface' : 'Illustrative example'}
              </p>
              <p className="mt-1 text-[0.78rem] leading-relaxed text-h26-textSecondary">{option.description}</p>
            </div>
            {Preview && <Preview auth={auth} onContinue={onContinue} voteLink={auth ? voteLink : ''} />}
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
