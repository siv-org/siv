export const hoverable = `cursor-pointer hover:bg-[#f2f2f2]`

export const CheckboxCell = ({
  checked,
  index,
  last_selected,
  pressing_shift,
  set_checked,
  set_last_selected,
  visible_indices,
}: {
  checked: boolean[]
  index: number
  last_selected?: number
  pressing_shift: boolean
  set_checked: (checked: boolean[]) => void
  set_last_selected: (index?: number) => void
  // Indices (into checked[]) of the rows currently visible after filtering
  visible_indices: number[]
}) => {
  return (
    <td
      className={`${hoverable}`}
      onClick={() => {
        const new_checked = [...checked]
        if (pressing_shift && last_selected !== undefined) {
          // If they're holding shift, set all *visible* rows between last_selected and this index
          // to !checked[index], so hidden (e.g. already-voted) rows in-between aren't touched
          const [lo, hi] = [Math.min(index, last_selected), Math.max(index, last_selected)]
          visible_indices.forEach((i) => {
            if (i >= lo && i <= hi) new_checked[i] = !checked[index]
          })
        } else {
          new_checked[index] = !checked[index]
        }

        set_last_selected(index)
        set_checked(new_checked)
      }}
    >
      <input checked={!!checked[index]} className="cursor-pointer" readOnly type="checkbox" />
    </td>
  )
}

export const CheckboxHeaderCell = ({
  checked,
  set_checked,
  set_last_selected,
  visible_indices,
}: {
  checked: boolean[]
  set_checked: (checked: boolean[]) => void
  set_last_selected: (index?: number) => void
  // Indices (into checked[]) of the rows currently visible after filtering
  visible_indices: number[]
}) => (
  <th>
    <input
      // Only reflect as checked when every visible row is selected
      checked={visible_indices.length > 0 && visible_indices.every((i) => checked[i])}
      className="cursor-pointer"
      onChange={(event) => {
        // Only toggle the currently visible rows, leaving hidden rows untouched
        const new_checked = [...checked]
        visible_indices.forEach((i) => (new_checked[i] = event.target.checked))
        set_checked(new_checked)
        set_last_selected(undefined)
      }}
      readOnly
      type="checkbox"
    />
  </th>
)
