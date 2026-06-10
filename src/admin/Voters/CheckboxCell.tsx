export const hoverable = `cursor-pointer hover:bg-[#f2f2f2]`

const range_of = (lo: number, hi: number) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)

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
  visible_indices?: number[]
}) => {
  return (
    <td
      className={`${hoverable}`}
      onClick={() => {
        const new_checked = [...checked]
        if (pressing_shift && last_selected !== undefined) {
          // If they're holding shift, set all *visible* rows between last_selected and this index to !checked[index], so hidden (e.g. already-voted) rows in-between aren't touched
          const [lo, hi] = [Math.min(index, last_selected), Math.max(index, last_selected)]
          const range = visible_indices?.filter((i) => i >= lo && i <= hi) ?? range_of(lo, hi)
          range.forEach((i) => (new_checked[i] = !checked[index]))
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
  visible_indices?: number[]
}) => {
  const targets = visible_indices ?? range_of(0, checked.length - 1)
  return (
    <th>
      <input
        // Only reflect as checked when every visible row is selected
        checked={targets.length > 0 && targets.every((i) => checked[i])}
        className="cursor-pointer"
        onChange={(event) => {
          // "Select All" means exactly the visible set: clear everything, then(when checking) select only the currently visible rows
          const new_checked = new Array(checked.length).fill(false)
          if (event.target.checked) targets.forEach((i) => (new_checked[i] = true))
          set_checked(new_checked)
          set_last_selected(undefined)
        }}
        readOnly
        type="checkbox"
      />
    </th>
  )
}
