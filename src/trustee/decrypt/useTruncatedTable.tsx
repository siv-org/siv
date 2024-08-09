import { useEffect, useState } from 'react'

export const useTruncatedTable = ({
  max_cells_to_show = 50,
  num_cols,
  num_rows,
}: {
  max_cells_to_show?: number
  num_cols: number
  num_rows: number
}) => {
  const num_truncated_rows = Math.floor(max_cells_to_show / num_cols)
  const any_to_truncate = num_rows > num_truncated_rows
  const [isTruncated, setTruncated] = useState(any_to_truncate)
  useEffect(() => setTruncated(any_to_truncate), [any_to_truncate]) // In case data loads after init render

  const rows_to_show = isTruncated ? num_truncated_rows : num_rows

  function TruncationToggle() {
    if (!any_to_truncate) return null

    return (
      <div>
        <a className="text-xs text-center opacity-50 cursor-pointer" onClick={() => setTruncated(!isTruncated)}>
          {isTruncated
            ? `...and ${Math.ceil(num_rows - num_truncated_rows)} more rows.`
            : `Truncate to < ${max_cells_to_show} total selections.`}
        </a>
      </div>
    )
  }

  return { TruncationToggle, rows_to_show }
}
