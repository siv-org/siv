import { useRouter } from 'next/router'
import { TailwindPreflight } from 'src/TailwindPreflight'

import { AddEmailPage } from './AddEmailPage'
import { YOBPage } from './YOBPage'

export const test_election_id_11chooses = '1764391039716'

export const hasCustomAuthFlow = (election_id: string) => election_id === test_election_id_11chooses

export const CustomAuthFlow = ({ auth }: { auth: string }) => {
  const { query } = useRouter()
  const passedYOB = query.passed_yob === 'true'

  return (
    <div className="text-center">
      {!passedYOB ? <YOBPage {...{ auth }} /> : <AddEmailPage {...{ auth }} />}

      <TailwindPreflight />
    </div>
  )
}
