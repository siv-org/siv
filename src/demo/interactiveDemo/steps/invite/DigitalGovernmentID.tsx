import { Fingerprint } from 'lucide-react'

import { IdentityCheckPreview } from './IdentityCheckPreview'

export function DigitalGovernmentID() {
  return <IdentityCheckPreview caption="Sign in with your supported digital ID" icon={Fingerprint} />
}
