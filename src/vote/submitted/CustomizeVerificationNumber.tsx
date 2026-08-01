import { Check, PenLine } from 'lucide-react'
import { Dispatch, useEffect, useRef, useState } from 'react'
import { h26fonts } from 'src/homepage2026/fonts'

import { strengthenTracking } from '../strengthen-tracking'
import { State } from '../vote-state'

type Step = 'closed' | 'digits' | 'done' | 'write-down'

export function CustomizeVerificationNumber({
  dispatch,
  onCancel,
  startOpen = false,
  state,
}: {
  dispatch: Dispatch<Record<string, string>>
  onCancel?: () => void
  startOpen?: boolean
  state: State
}) {
  const [step, setStep] = useState<Step>(
    state.tracking_customized_at ? 'done' : startOpen ? 'write-down' : 'closed',
  )
  const [digits, setDigits] = useState('')
  const [deviceSnapshot, setDeviceSnapshot] = useState(state.tracking || '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step === 'digits') inputRef.current?.focus()
  }, [step])

  if (!state.tracking) return null

  const device = deviceSnapshot.padStart(14, '0')
  const preview = digits.length === 4 ? strengthenTracking(deviceSnapshot, digits) : null
  const [d1, d2, d3] = device.split('-')
  const [r1, r2, r3] = (preview ?? '····-····-····').split('-')

  const open = () => {
    if (!state.tracking) return
    setDeviceSnapshot(state.tracking)
    setDigits('')
    setStep('write-down')
  }

  const apply = () => {
    if (!preview) return
    dispatch({ tracking: preview })
    setStep('done')
  }

  return (
    <div className={`mt-1 w-full min-w-0 max-w-full ${h26fonts}`}>
      {step === 'closed' && !startOpen && (
        <button
          className="group inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-sans text-[0.85rem] text-h26-green cursor-pointer transition-colors duration-200 hover:text-h26-greenHover"
          onClick={open}
          type="button"
        >
          <PenLine
            className="size-3.5 opacity-80 transition-transform duration-200 group-hover:-rotate-6"
            strokeWidth={1.75}
          />
          Customize your Verification Number
        </button>
      )}

      {step === 'done' && (
        <div className="inline-flex items-center gap-1.5 text-[0.85rem] text-h26-green animate-[fadeInUp_0.5s_ease-out_both]">
          <Check className="size-3.5" strokeWidth={2} />
          <span className="font-medium">Customized</span>
        </div>
      )}

      {(step === 'write-down' || step === 'digits') && (
        <div
          className={[
            'mt-1.5 w-full max-w-lg rounded-[20px] p-4 sm:p-6 md:p-7',
            'bg-white/75 border border-white/80',
            'shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.5)]',
            'backdrop-blur-md',
            'animate-[fadeInUp_0.45s_ease-out_both]',
          ].join(' ')}
        >
          <h4 className="mt-2 mb-0 font-serif26 text-[1.35rem] font-normal tracking-tight text-h26-text md:text-[1.5rem]">
            Customize
          </h4>

          {step === 'write-down' && (
            <div className="mt-4">
              <p className="m-0 text-[0.95rem] leading-[1.65] text-h26-textSecondary">
                Write down your current verification number first — before entering any digits.
              </p>
              <p className="mt-6 mb-0 text-center font-mono26 text-[1.25rem] tracking-[0.06em] text-h26-text tabular-nums sm:text-[1.6rem] sm:tracking-[0.1em] md:text-[1.75rem]">
                {device}
              </p>
              <div className="flex flex-wrap gap-4 items-center mt-7">
                <button
                  className="inline-flex items-center rounded-full border-0 bg-h26-green px-6 py-3 font-sans text-[0.9rem] font-medium text-white cursor-pointer shadow-h26-cta transition-all duration-300 hover:-translate-y-0.5 hover:bg-h26-greenHover hover:shadow-h26-cta-hover"
                  onClick={() => setStep('digits')}
                  type="button"
                >
                  I wrote it down
                </button>
                <button
                  className="border-0 bg-transparent p-0 font-sans text-[0.9rem] text-h26-muted cursor-pointer hover:text-h26-textSecondary"
                  onClick={() => (onCancel ? onCancel() : setStep('closed'))}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {step === 'digits' && (
            <div className="mt-4 min-w-0">
              <p className="m-0 text-[0.95rem] leading-[1.65] text-h26-textSecondary">
                Add any 4 digits. They&apos;ll be combined into the last group of your number.
              </p>

              {/* Prefix + last-group columns: hyphens stay in the mono string so they align with digits */}
              <div className="mt-5 min-w-0 rounded-2xl border border-black/[0.06] bg-h26-bg/90 px-3 py-4 sm:px-5 sm:py-5">
                <div className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_5.25rem] items-center gap-y-4 sm:grid-cols-[6.75rem_minmax(0,1fr)_6.5rem] sm:gap-y-5">
                  <span className="pr-2 text-[0.85rem] text-h26-muted sm:pr-0 sm:text-[0.95rem]">Device</span>
                  <span className="min-w-0 font-mono26 text-[1.05rem] tracking-[0.04em] tabular-nums text-h26-text text-right sm:text-[1.35rem] sm:tracking-[0.08em]">
                    {d1}-{d2}-
                  </span>
                  <span className="font-mono26 text-[1.05rem] tracking-[0.04em] tabular-nums text-h26-text text-center sm:text-[1.35rem] sm:tracking-[0.08em]">
                    {d3}
                  </span>

                  <span className="pr-2 text-[0.85rem] text-h26-muted sm:pr-0 sm:text-[0.95rem]">You add</span>
                  <span />
                  <input
                    className="box-border h-11 w-full rounded-lg border border-black/10 bg-white font-mono26 text-[1.05rem] tracking-[0.08em] text-center text-h26-text tabular-nums outline-none transition-shadow focus:border-h26-green/45 focus:shadow-[0_0_0_4px_rgba(26,107,74,0.12)] sm:h-12 sm:text-[1.35rem] sm:tracking-[0.12em]"
                    inputMode="numeric"
                    maxLength={4}
                    onChange={(e) => setDigits(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    pattern="\d*"
                    placeholder="····"
                    ref={inputRef}
                    value={digits}
                  />

                  <span className="pr-2 text-[0.85rem] text-h26-muted sm:pr-0 sm:text-[0.95rem]">Result</span>
                  <span
                    className={`min-w-0 font-mono26 text-[1.05rem] tracking-[0.04em] tabular-nums text-right sm:text-[1.35rem] sm:tracking-[0.08em] ${
                      preview ? 'font-medium text-h26-text' : 'text-h26-text'
                    }`}
                  >
                    {r1}-{r2}-
                  </span>
                  <span
                    className={`font-mono26 text-[1.05rem] tracking-[0.04em] tabular-nums text-center sm:text-[1.35rem] sm:tracking-[0.08em] ${
                      preview ? 'font-medium text-h26-text' : 'text-h26-text'
                    }`}
                  >
                    {r3}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center mt-6">
                <button
                  className="inline-flex items-center rounded-full border-0 bg-h26-green px-6 py-3 font-sans text-[0.9rem] font-medium text-white cursor-pointer shadow-h26-cta transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:bg-h26-greenHover enabled:hover:shadow-h26-cta-hover disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!preview}
                  onClick={apply}
                  type="button"
                >
                  Apply
                </button>
                <button
                  className="border-0 bg-transparent p-0 font-sans text-[0.9rem] text-h26-muted cursor-pointer hover:text-h26-textSecondary"
                  onClick={() => setStep('write-down')}
                  type="button"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
