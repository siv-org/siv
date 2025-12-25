import { ReactNode, useState } from 'react'

export const HowDoesItWork = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [openSection, setOpenSection] = useState<1 | 2 | 3 | null>(1)

  const toggleSection = (section: 1 | 2 | 3) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="w-full max-w-[23rem]">
      <button
        className={`p-2 w-full font-medium bg-sky-100 rounded-md text-black/75 hover:bg-sky-200 active:bg-sky-300 select-none ${
          isOpen ? 'rounded-b-none' : ''}`}
        onClick={() => {
          setIsOpen(!isOpen)
          if (isOpen) setOpenSection(null)
        }}
      >
        How does it work?
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 max-h-[800px]' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 py-2 w-full text-center border shadow-lg">
          {/* 1: Setup */}
          <AccordionSection isOpen={openSection === 1} onToggle={() => toggleSection(1)} title="Setup">
            <div className="pt-1.5 text-xs font-medium uppercase opacity-60">Choose your</div>

            <ol className="flex justify-between mt-1.5 w-full max-w-[18rem] mx-auto pb-2.5">
              {[
                ['Voters List', 'text-green-800', 'bg-green-200'],
                ['Question(s)', 'text-orange-800', 'bg-orange-200'],
              ].map(([title, color, bgColor], index) => (
                <li key={index}>
                  <span
                    className={`inline-flex justify-center items-center mr-1.5 w-7 h-7 font-semibold ${color} text-sm ${bgColor} rounded-full`}
                  >
                    {index + 1}
                  </span>
                  {title}
                </li>
              ))}
            </ol>
          </AccordionSection>

          {/* 2: Voting Period */}
          <AccordionSection
            hasBorderTop
            isOpen={openSection === 2}
            onToggle={() => toggleSection(2)}
            title="Voting Period"
          >
            <ul className="mt-2 space-y-1.5 text-sm list-disc list-inside text-left">
              <li>
                Voters can <b>vote from own devices</b> in seconds
              </li>
              <li>Everyone can see encrypted votes arrive in real-time</li>
            </ul>
            <div className="mt-3 text-sm italic">
              <div>
                &quot;The easiest voting experience I&apos;ve ever had&quot;
                <div className="text-xs">- A voter</div>
              </div>
              <div className="mt-1.5">
                &quot;Like voting nirvana&quot;
                <div className="text-xs">- An election official</div>
              </div>
            </div>
          </AccordionSection>

          {/* 3: Verifiable Results */}
          <AccordionSection
            hasBorderTop
            isOpen={openSection === 3}
            onToggle={() => toggleSection(3)}
            title="Verifiable Results"
          >
            <ul className="mt-2 text-sm list-disc list-inside text-left">
              <li>
                Voters can <b className="font-semibold text-green-700">confirm own votes</b> are counted as intended
              </li>
              <li>
                <b className="font-semibold text-sky-600">Voter Roll auditable</b> against fake voters, ballot stuffing
              </li>
              <p className="mt-3">
                Advanced protections against <b className="font-semibold text-purple-700">Malware</b>,{' '}
                <b className="font-semibold text-red-700">Coercion</b>,{' '}
                <b className="font-semibold text-orange-600">False Claims</b>
              </p>
            </ul>
          </AccordionSection>
        </div>
      </div>
    </div>
  )
}

const AccordionSection = ({
  children,
  hasBorderTop = false,
  isOpen,
  onToggle,
  title,
}: {
  children: ReactNode
  hasBorderTop?: boolean
  isOpen: boolean
  onToggle: () => void
  title: string
}) => (
  <section className={hasBorderTop ? 'pt-2 my-2 border-t border-gray-400/70' : ''}>
    {/* Header */}
    <button
      className="flex justify-between items-center py-3.5 w-full text-left hover:bg-black/5 px-2 rounded"
      onClick={onToggle}
    >
      <span className="text-[13px] font-medium uppercase">{title}</span>
      <span className="pr-1 text-xs">{isOpen ? '−' : '+'}</span>
    </button>

    {/* Expanded Content */}
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out px-2 ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      {children}
    </div>
  </section>
)
