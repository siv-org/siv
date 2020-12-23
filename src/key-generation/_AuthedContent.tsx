import { GlobalCSS } from '../GlobalCSS'
import { Trustees } from './1-Trustees'
import { PublicThresholdKey } from './10-PublicThresholdKey'
import { Parameters } from './2-Parameters'
import { MessagingKeys } from './3-MessagingKeys'
import { PrivateCoefficients } from './4-PrivateCoefficients'
import { PublicCommitments } from './5-PublicCommitments'
import { SendPairwiseShares } from './6-SendPairwiseShares'
import { ReceivedPairwiseShares } from './7-ReceivedPairwiseShares'
import { VerifyShares } from './8-VerifyShares'
import { CalculatePrivateKeyshare } from './9-CalculatePrivateKeyshare'
import { getTrusteesOnInit } from './get-latest-from-server'
import { useKeyGenState } from './keygen-state'
import { initPusher } from './pusher-helper'

export const AuthedContent = ({
  election_id,
  trustee_auth,
}: {
  election_id: string
  trustee_auth: string
}): JSX.Element => {
  // Initialize local vote state on client
  const [state, dispatch] = useKeyGenState({ election_id, trustee_auth })

  // Get initial Trustee info
  getTrusteesOnInit({ dispatch, state })

  // Activate Pusher to get updates from the server on new data
  initPusher({ dispatch, state })

  return (
    <>
      <Trustees {...{ state }} />
      <Parameters {...{ state }} />
      <MessagingKeys {...{ dispatch, state }} />
      <PrivateCoefficients {...{ dispatch, state }} />
      <PublicCommitments {...{ dispatch, state }} />
      <SendPairwiseShares {...{ dispatch, state }} />
      <ReceivedPairwiseShares {...{ dispatch, state }} />
      <VerifyShares {...{ state }} />
      <CalculatePrivateKeyshare {...{ state }} />
      <PublicThresholdKey {...{ state }} />

      <style jsx>{``}</style>
      <GlobalCSS />
    </>
  )
}
