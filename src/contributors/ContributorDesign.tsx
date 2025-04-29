interface ContributorProps {
  affiliation: string
  focus: string
  name: string
}

export const ContributorDesign = ({ affiliation, focus, name }: ContributorProps) => {
  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md contributor-card">
      <h2 className="mb-2 text-2xl font-bold text-gray-800">{name}</h2>
      <div className="mb-2 text-gray-600">
        <span className="font-semibold">Focus:</span> {focus}
      </div>
      <div className="text-gray-600">
        <span className="font-semibold">Affiliation:</span> {affiliation}
      </div>
    </div>
  )
}
