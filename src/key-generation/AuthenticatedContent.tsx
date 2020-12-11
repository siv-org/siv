import { GlobalCSS } from '../GlobalCSS'
import { Attendees } from './Attendees'
import { CalculatePrivateKeyshare } from './CalculatePrivateKeyshare'
import { MessagingKeys } from './MessagingKeys'
import { PairwiseShares } from './PairwiseShares'
import { Parameters } from './Parameters'
import { PrivateCoefficients } from './PrivateCoefficients'
import { PublicBroadcastValues } from './PublicBroadcastValues'
import { PublicThresholdKey } from './PublicThresholdKey'
import { useKeyGenState } from './useKeyGenState'
import { VerifyShares } from './VerifyShares'

export const AuthenticatedContent = ({
  election_id,
  trustee_auth,
}: {
  election_id: string
  trustee_auth: string
}): JSX.Element => {
  // Initialize local vote state on client
  const [state] = useKeyGenState(`keygen-${election_id}-${trustee_auth}`)

  return (
    <>
      <Attendees />
      <Parameters {...{ state }} />
      <MessagingKeys {...{ state }} />
      <PrivateCoefficients {...{ state }} />
      <PublicBroadcastValues {...{ state }} />
      <PairwiseShares {...{ state }} />
      <VerifyShares {...{ state }} />
      <CalculatePrivateKeyshare {...{ state }} />
      <PublicThresholdKey {...{ state }} />

      <style jsx>{``}</style>
      <GlobalCSS />
    </>
  )
}
