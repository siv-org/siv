import { State } from './vote-state'

export const PrivacyProtectorsStatements = ({ state }: { state: State }) => {
  if (!state.privacy_protectors_statements) return null

  return (
    <div className="pl-5 mb-3 -mt-3 opacity-50">
      <a href={state.privacy_protectors_statements} rel="noreferrer" target="_blank">
        Privacy Protectors{"'"} Statements
      </a>
    </div>
  )
}
