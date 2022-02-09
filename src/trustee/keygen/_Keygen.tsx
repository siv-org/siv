import { StateAndDispatch } from '../trustee-state'
import { ResetButton } from './_ResetButton'
import { Trustees } from './1-Trustees'
import { PublicThresholdKey } from './10-PublicThresholdKey'
import { PartialDecryptionTest } from './11-PartialDecryptionTest'
import { CombinePartials } from './12-CombinePartials'
import { Parameters } from './2-Parameters'
import { MessagingKeys } from './3-MessagingKeys'
import { PrivateCoefficients } from './4-PrivateCoefficients'
import { PublicCommitments } from './5-PublicCommitments'
import { SendPairwiseShares } from './6-SendPairwiseShares'
import { ReceivedPairwiseShares } from './7-ReceivedPairwiseShares'
import { VerifyShares } from './8-VerifyShares'
import { CalculatePrivateKeyshare } from './9-CalculatePrivateKeyshare'

export const Keygen = ({ dispatch, state }: StateAndDispatch): JSX.Element => {
  return (
    <>
      <h2>Threshold Key Generation</h2>
      <p>
        Your computer handles this stage automatically.
        <br />
        The transcript below is provided to be able to verify the work.
      </p>
      <ResetButton {...{ state }} />
      <Trustees {...{ state }} />
      <Parameters {...{ state }} />
      <MessagingKeys {...{ dispatch, state }} />
      <PrivateCoefficients {...{ dispatch, state }} />
      <PublicCommitments {...{ dispatch, state }} />
      <SendPairwiseShares {...{ dispatch, state }} />
      <ReceivedPairwiseShares {...{ dispatch, state }} />
      <VerifyShares {...{ dispatch, state }} />
      <CalculatePrivateKeyshare {...{ dispatch, state }} />
      <PublicThresholdKey {...{ dispatch, state }} />
      <PartialDecryptionTest {...{ dispatch, state }} />
      <CombinePartials {...{ dispatch, state }} />
    </>
  )
}
