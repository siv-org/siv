const Column = ({ topLabel, value }: { topLabel: string; value: string }) => (
  <div className="mt-2 text-center text-gray-600 sm:text-left sm:mt-0 sm:w-48">
    <span className="text-xs tracking-wide text-gray-500 uppercase">{topLabel}</span>
    <p className="mt-0.5 text-gray-900 text-base">{value}</p>
  </div>
)

export const ContributorRow = ({ affiliation, focus, name }: { affiliation: string; focus: string; name: string }) => {
  return (
    <div className="flex flex-col p-4 mb-2 transition duration-300 rounded-2xl hover:bg-gray-100 sm:flex-row sm:justify-between">
      <h2 className="mb-2 text-xl font-medium tracking-tight text-center text-gray-900 sm:w-1/3 sm:text-left sm:mb-0">
        {name}
      </h2>
      <Column topLabel="Focus" value={focus} />
      <Column topLabel="Relevant Affiliation" value={affiliation} />
    </div>
  )
}
