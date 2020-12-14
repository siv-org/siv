import { GlobalCSS } from '../GlobalCSS'
import { Trustees } from './1-Trustees'
import { Parameters } from './2-Parameters'
import { MessagingKeys } from './3-MessagingKeys'
import { PrivateCoefficients } from './4-PrivateCoefficients'
import { PublicCommitments } from './5-PublicCommitments'
import { PairwiseShares } from './6-PairwiseShares'
import { VerifyShares } from './7-VerifyShares'
import { CalculatePrivateKeyshare } from './8-CalculatePrivateKeyshare'
import { PublicThresholdKey } from './9-PublicThresholdKey'
import { getTrusteesOnInit } from './get-latest-from-server'
import { initPusher } from './pusher-helper'
import { useKeyGenState } from './useKeyGenState'

export const AuthenticatedContent = ({
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
      <PairwiseShares {...{ state }} />
      <VerifyShares {...{ state }} />
      <CalculatePrivateKeyshare {...{ state }} />
      <PublicThresholdKey {...{ state }} />

      <style jsx>{``}</style>
      <GlobalCSS />
    </>
  )
}
