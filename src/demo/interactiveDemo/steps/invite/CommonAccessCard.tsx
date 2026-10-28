import { CreditCard } from 'lucide-react'

import { IdentityCheckPreview } from './IdentityCheckPreview'

export function CommonAccessCard() {
  return <IdentityCheckPreview caption="Card + reader + PIN" icon={CreditCard} />
}
