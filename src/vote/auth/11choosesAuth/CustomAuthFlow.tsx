export const test_election_id_11chooses = '1764391039716' // 11_chooses Test Auth

export const hasCustomAuthFlow = (election_id: string): boolean => {
  return election_id === test_election_id_11chooses
}

export const CustomAuthFlow = ({ auth, election_id }: { auth: string; election_id: string }): JSX.Element | null => {
  return (
    <div>
      <h1>Custom Auth Flow</h1>
      <p>Auth: {auth}</p>
      <p>Election ID: {election_id}</p>
    </div>
  )
}
