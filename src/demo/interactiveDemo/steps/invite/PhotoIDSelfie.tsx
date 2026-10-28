import { UserRound } from 'lucide-react'

import { IdentityCheckPreview } from './IdentityCheckPreview'

export function PhotoIDSelfie() {
  return <IdentityCheckPreview caption="Government-issued ID + selfie" icon={UserRound} />
}
