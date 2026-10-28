import { Smartphone } from 'lucide-react'

import { IdentityCheckPreview } from './IdentityCheckPreview'

export function TextMessageVerification() {
  return <IdentityCheckPreview caption="Enter your one-time verification code" code icon={Smartphone} />
}
