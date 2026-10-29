import {
  ArrowRight,
  Camera,
  ChevronRight,
  Ellipsis,
  IdCard,
  KeyRound,
  Mail,
  MessageSquare,
  PenLine,
  Send,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { CSSProperties, useState } from 'react'

import { PrimaryButton } from '../../shared/PrimaryButton'
import { DigitalGovernmentID } from './DigitalGovernmentID'
import { EmailInvitation } from './EmailInvitation'
import { ExistingCredentials } from './ExistingCredentials'
import { InPersonInvitation } from './InPersonInvitation'
import { OtherMethods } from './OtherMethods'
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
    icon: Camera,
    id: 'photo',
    label: 'Photo ID + Selfie',
    preview: PhotoIDSelfie,
  },
  {
    description: 'Your drawn signature is compared with the one on your voter registration record.',
    icon: PenLine,
    id: 'signature',
    label: 'Drawn Signature',
    preview: SignatureVerification,
  },
  {
    icon: Ellipsis,
    id: 'other',
    label: 'Other Methods',
    preview: OtherMethods,
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
  // Keep the signature iframe mounted after opening so closing it preserves the drawing.
  const [signatureOpened, setSignatureOpened] = useState(false)
  const selectedIndex = options.findIndex(({ id }) => id === selected)

  return (
    <div>
      <p className="mb-3 text-[0.75rem] font-medium tracking-wide text-h26-textSecondary">Options, can be combined:</p>
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
            onClick={() => {
              if (id === 'signature') setSignatureOpened(true)
              setSelected(selected === id ? null : id)
            }}
            style={{ order: index * 2 }}
            type="button"
          >
            <OptionIcon aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
            <span>{label}</span>
          </button>
        ))}
        {options
          .filter(({ id }) => id === selected || (id === 'signature' && signatureOpened))
          .map((option) => {
            const Preview = option.preview
            return (
              <section
                aria-label={`${option.label} example`}
                aria-live="polite"
                className="col-span-full min-w-0 overflow-hidden rounded-2xl border border-black/[0.06] bg-white/60 order-[var(--preview-order)] sm:order-[var(--preview-order-sm)]"
                hidden={option.id !== selected}
                id={option.id === selected ? 'invitation-preview' : undefined}
                key={option.id}
                // Match the grid breakpoint to position the preview below its selected row.
                style={
                  {
                    '--preview-order': Math.floor(selectedIndex / 2) * 4 + 3,
                    '--preview-order-sm': Math.floor(selectedIndex / 3) * 6 + 5,
                  } as CSSProperties
                }
              >
                {(option.description || option.id === 'photo') && (
                  <div
                    className={`relative border-b border-black/[0.06] px-5 sm:px-6 ${
                      option.description ? 'pb-8 pt-4' : 'pt-6'
                    }`}
                  >
                    {option.description && (
                      <p className="text-[0.78rem] leading-relaxed text-h26-textSecondary">{option.description}</p>
                    )}
                    <span className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2 rounded-full border border-black/10 bg-h26-bg px-3 py-0.5 text-[11px] font-medium tracking-wide text-h26-textSecondary">
                      Example
                    </span>
                  </div>
                )}
                <Preview
                  auth={auth}
                  onClose={() => setSelected(null)}
                  onContinue={onContinue}
                  voteLink={auth ? voteLink : ''}
                  voterNumber={voterNumber}
                />
              </section>
            )
          })}
      </div>
      {/* Auditability note shared by all authentication methods. */}
      <details className="group mt-6 border-t border-black/[0.07] pt-5">
        <summary className="flex cursor-pointer list-none items-center gap-3 rounded-sm text-[0.85rem] font-medium text-h26-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-h26-green [&::-webkit-details-marker]:hidden">
          <ShieldCheck aria-hidden className="size-5 shrink-0 text-h26-green" strokeWidth={1.5} />
          Preserving Full Auditability
          <ChevronRight aria-hidden className="size-4 text-h26-muted transition-transform group-open:rotate-90" />
        </summary>
        <div className="ml-8">
          <p className="mt-2 text-[0.78rem] leading-relaxed text-h26-textSecondary">
            To protect against ballot stuffing and other fraud:
          </p>
          <p className="mt-2 text-[0.78rem] leading-relaxed text-h26-textSecondary">
            No matter which method an election uses, SIV Authentication is designed so that every vote&apos;s
            eligibility can still be justified via auditing, even after results are announced.
          </p>
        </div>
      </details>
      <div className="mt-6 flex justify-end border-t border-black/[0.07] pt-5">
        <PrimaryButton disabled={!auth} onClick={onContinue}>
          Open ballot <ArrowRight aria-hidden className="ml-2 size-4" />
        </PrimaryButton>
      </div>
    </div>
  )
}
