// import useSWR from 'swr'

export const PaperTotals = () => {
  const paperTotals = usePaperTotals()

  if (!paperTotals) return null

  return (
    <>
      <p>Subtotals from Paper ballots</p>
      <p></p>
    </>
  )
}

// TODO
// - Download data from api
// - Show paper subtotals in UI
// - Add paper numbers to totals
const usePaperTotals = () => {
  //    const {data } = useSWR()

  return { ARCHES: 3 }
}
