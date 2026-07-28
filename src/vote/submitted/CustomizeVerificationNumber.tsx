import { Check, PenLine } from 'lucide-react'
import { Dispatch, useEffect, useRef, useState } from 'react'
import { h26fonts } from 'src/homepage2026/fonts'

import { strengthenTracking } from '../strengthen-tracking'
import { State } from '../vote-state'

type Step = 'closed' | 'digits' | 'done' | 'write-down'

export function CustomizeVerificationNumber({
  dispatch,
  state,
}: {
  dispatch: Dispatch<Record<string, string>>
  state: State
}) {
  const [step, setStep] = useState<Step>(state.tracking_customized_at ? 'done' : 'closed')
  const [digits, setDigits] = useState(['', '', '', ''])
  const [deviceSnapshot, setDeviceSnapshot] = useState(state.tracking || '')
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (step === 'digits') inputsRef.current[0]?.focus()
  }, [step])

  if (!state.tracking) return null

  const digitString = digits.join('')
  const preview = digitString.length === 4 ? strengthenTracking(deviceSnapshot, digitString) : null

  const open = () => {
    if (!state.tracking) return
    setDeviceSnapshot(state.tracking)
    setDigits(['', '', '', ''])
    setStep('write-down')
  }

  const setDigit = (index: number, raw: string) => {
    const char = raw.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)
    if (char && index < 3) inputsRef.current[index + 1]?.focus()
  }

  const onDigitKeyDown = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) inputsRef.current[index - 1]?.focus()
  }

  const onDigitPaste = (text: string) => {
    const chars = text.replace(/\D/g, '').slice(0, 4).split('')
    if (!chars.length) return
    const next = ['', '', '', '']
    chars.forEach((c, i) => (next[i] = c))
    setDigits(next)
    inputsRef.current[Math.min(chars.length, 3)]?.focus()
  }

  const apply = () => {
    if (!preview) return
    dispatch({ tracking: preview })
    setStep('done')
  }

  return (
    <div className={`mt-0.5 ${h26fonts}`}>
      {step === 'closed' && (
        <button
          className="group inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-sans text-[0.78rem] text-h26-green cursor-pointer transition-colors duration-200 hover:text-h26-greenHover"
          onClick={open}
          type="button"
        >
          <PenLine className="size-3.5 opacity-80 transition-transform duration-200 group-hover:-rotate-6" strokeWidth={1.75} />
          Customize
        </button>
      )}

      {step === 'done' && (
        <div className="inline-flex items-center gap-1.5 text-[0.78rem] text-h26-green animate-[fadeInUp_0.5s_ease-out_both]">
          <Check className="size-3.5" strokeWidth={2} />
          <span className="font-medium">Customized</span>
        </div>
      )}

      {(step === 'write-down' || step === 'digits') && (
        <div
          className={[
            'mt-1 max-w-md rounded-[18px] p-5 md:p-6',
            'bg-white/70 border border-white/80',
            'shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.5)]',
            'backdrop-blur-md',
            'animate-[fadeInUp_0.45s_ease-out_both]',
          ].join(' ')}
        >
          <span className="font-mono26 text-[0.58rem] uppercase tracking-[0.2em] text-h26-green">Optional</span>
          <h4 className="mt-1.5 mb-0 font-serif26 text-[1.05rem] font-normal tracking-tight text-h26-text">
            Customize
          </h4>

          {step === 'write-down' && (
            <div className="mt-4">
              <p className="m-0 text-[0.82rem] leading-[1.6] text-h26-textSecondary">
                Write down your current verification number first — before entering any digits.
              </p>
              <p className="mt-4 mb-0 text-center font-mono26 text-[1.35rem] tracking-[0.12em] text-h26-text tabular-nums">
                {deviceSnapshot.padStart(14, '0')}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  className="inline-flex items-center rounded-full border-0 bg-h26-green px-5 py-2.5 font-sans text-[0.82rem] font-medium text-white cursor-pointer shadow-h26-cta transition-all duration-300 hover:-translate-y-0.5 hover:bg-h26-greenHover hover:shadow-h26-cta-hover"
                  onClick={() => setStep('digits')}
                  type="button"
                >
                  I wrote it down
                </button>
                <button
                  className="border-0 bg-transparent p-0 font-sans text-[0.78rem] text-h26-muted cursor-pointer hover:text-h26-textSecondary"
                  onClick={() => setStep('closed')}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {step === 'digits' && (
            <div className="mt-4">
              <p className="m-0 text-[0.82rem] leading-[1.6] text-h26-textSecondary">
                Add any 4 digits. They&apos;ll be combined into the last group of your number.
              </p>

              <div className="mt-5 grid gap-2.5 text-[0.8rem]">
                <Row label="Device" value={deviceSnapshot.padStart(14, '0')} />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-h26-muted shrink-0">You add</span>
                  <div className="flex gap-1.5">
                    {digits.map((d, i) => (
                      <input
                        className="h-10 w-9 rounded-lg border border-black/10 bg-white/90 text-center font-mono26 text-[1.05rem] text-h26-text outline-none transition-shadow focus:border-h26-green/40 focus:shadow-[0_0_0_3px_rgba(26,107,74,0.12)]"
                        inputMode="numeric"
                        key={i}
                        maxLength={1}
                        onChange={(e) => setDigit(i, e.target.value)}
                        onKeyDown={(e) => onDigitKeyDown(i, e.key)}
                        onPaste={(e) => {
                          e.preventDefault()
                          onDigitPaste(e.clipboardData.getData('text'))
                        }}
                        pattern="\d*"
                        ref={(el) => {
                          inputsRef.current[i] = el
                        }}
                        value={d}
                      />
                    ))}
                  </div>
                </div>
                <Row
                  emphasize
                  label="Result"
                  value={preview?.padStart(14, '0') ?? '····-····-····'}
                />
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  className="inline-flex items-center rounded-full border-0 bg-h26-green px-5 py-2.5 font-sans text-[0.82rem] font-medium text-white cursor-pointer shadow-h26-cta transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:bg-h26-greenHover enabled:hover:shadow-h26-cta-hover disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!preview}
                  onClick={apply}
                  type="button"
                >
                  Apply
                </button>
                <button
                  className="border-0 bg-transparent p-0 font-sans text-[0.78rem] text-h26-muted cursor-pointer hover:text-h26-textSecondary"
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

function Row({ emphasize, label, value }: { emphasize?: boolean; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-h26-muted shrink-0">{label}</span>
      <span
        className={[
          'font-mono26 tracking-[0.08em] tabular-nums',
          emphasize ? 'text-h26-text font-medium' : 'text-h26-textSecondary',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  )
}
