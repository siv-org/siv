interface ContributorProps {
  affiliation: string
  focus: string
  name: string
}

const InfoBlock = ({ label, value }: { label: string; value: string }) => (
  <div className="mt-2 text-gray-600 sm:text-left sm:w-1/3 sm:mt-0">
    <span className="text-xs tracking-wide text-gray-500 uppercase">{label}</span>
    <p className="mt-0.5 text-gray-900 text-sm">{value}</p>
  </div>
)

export const ContributorDesign = ({ affiliation, focus, name }: ContributorProps) => {
  return (
    <div className="flex flex-col p-4 mb-2 transition-all duration-300 bg-white group rounded-2xl hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="flex-shrink-0 mb-2 text-xl font-medium tracking-tight text-gray-900 sm:mb-0 sm:w-1/3">{name}</h2>
      <div className="flex flex-col flex-1 sm:flex-row sm:items-center sm:gap-8">
        <InfoBlock label="Focus" value={focus} />
        <InfoBlock label="Affiliation" value={affiliation} />
      </div>
    </div>
  )
}
