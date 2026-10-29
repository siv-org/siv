import { MessageSquare, Plus, ScanLine, Video } from 'lucide-react'

const checks = [
  {
    description:
      'Voters use their phone’s NFC reader to verify the chip in a valid passport. This is a low-cost, privacy-preserving method.',
    icon: ScanLine,
    title: 'Passport Scan',
  },
  {
    description: 'Voters show their photo ID to an election worker during a Zoom video call.',
    icon: Video,
    title: 'Virtual Poll',
  },
  {
    description:
      'Voters verify a non-VoIP phone number by text message. Its Caller ID name must match their voter record.',
    icon: MessageSquare,
    title: 'SMS Verification',
  },
]

export function OtherMethods() {
  return (
    <div className="px-6 py-7 sm:px-8 sm:py-8">
      <h3 className="font-serif26 text-xl text-h26-text">Provisional ballot process</h3>

      {/* Find the voter record before completing an additional identity check. */}
      <ol className="mt-6 space-y-7">
        <li className="flex gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-h26-green/[0.08] text-xs text-h26-green">
            1
          </span>
          <div>
            <h4 className="text-[0.85rem] font-medium text-h26-text">Find your voter record</h4>
            <p className="mt-1 text-[0.8rem] leading-relaxed text-h26-textSecondary">
              Enter your name, address, and date of birth as they appear in the state’s voter registration records.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-h26-green/[0.08] text-xs text-h26-green">
            2
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="text-[0.85rem] font-medium text-h26-text">Complete one additional identity check</h4>
            {/* These are alternatives, not three required steps. */}
            <div className="mt-4 grid gap-5 sm:grid-cols-3 sm:gap-6">
              {checks.map(({ description, icon: Icon, title }) => (
                <div key={title}>
                  <Icon aria-hidden className="mb-2 size-5 text-h26-green" strokeWidth={1.5} />
                  <h5 className="text-[0.8rem] font-medium text-h26-text">{title}</h5>
                  <p className="mt-1 text-[0.75rem] leading-relaxed text-h26-textSecondary">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </li>
      </ol>

      {/* Custom authentication can be adapted to the election’s requirements. */}
      <div className="mt-7 border-t border-black/[0.07] pt-5">
        <p className="flex items-center gap-2 text-[0.85rem] font-medium text-h26-green">
          <Plus aria-hidden className="size-4" strokeWidth={1.5} />
          Add your own method
        </p>
        <p className="mt-1 text-[0.8rem] leading-relaxed text-h26-textSecondary">
          SIV can be adapted to work with your election’s authentication flow.
        </p>
      </div>
    </div>
  )
}
