import { TailwindPreflight } from 'src/TailwindPreflight'

import { InputFunds } from './InputFunds'
import { FinancialGuaranteeIntro } from './Intro'

export const FinancialGuarantee = () => {
  return (
    <div className="flex flex-col min-[950px]:gap-16 min-[950px]:flex-row">
      <FinancialGuaranteeIntro />
      <InputFunds />

      <TailwindPreflight />
    </div>
  )
}
