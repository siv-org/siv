interface ContributorProps {
  affiliation: string
  focus: string
  name: string
}

export const ContributorDesign = ({ affiliation, focus, name }: ContributorProps) => {
  return (
    <div className="p-8 mb-8 transition-all duration-300 bg-white group rounded-2xl hover:bg-gray-50">
      <h2 className="mb-4 text-2xl font-medium tracking-tight text-gray-900">{name}</h2>
      <div className="space-y-2">
        <div className="text-gray-600">
          <span className="text-sm tracking-wide text-gray-500 uppercase">Focus</span>
          <p className="mt-1 text-gray-900">{focus}</p>
        </div>
        <div className="text-gray-600">
          <span className="text-sm tracking-wide text-gray-500 uppercase">Affiliation</span>
          <p className="mt-1 text-gray-900">{affiliation}</p>
        </div>
      </div>
    </div>
  )
}
