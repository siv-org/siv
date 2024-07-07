export const hoverable = `cursor-pointer hover:bg-[#f2f2f2]`

export const CheckboxCell = ({
  checked,
  index,
  last_selected,
  pressing_shift,
  set_checked,
  set_last_selected,
}: {
  checked: boolean[]
  index: number
  last_selected?: number
  pressing_shift: boolean
  set_checked: (checked: boolean[]) => void
  set_last_selected: (index?: number) => void
}) => {
  return (
    <td
      className={`${hoverable}`}
      onClick={() => {
        const new_checked = [...checked]
        if (pressing_shift && last_selected !== undefined) {
          // If they're holding shift, set all between last_selected and this index to !checked[index]
          for (let i = Math.min(index, last_selected); i <= Math.max(index, last_selected); i += 1) {
            new_checked[i] = !checked[index]
          }
        } else {
          new_checked[index] = !checked[index]
        }

        set_last_selected(index)
        set_checked(new_checked)
      }}
    >
      <input readOnly checked={!!checked[index]} className="cursor-pointer" type="checkbox" />
    </td>
  )
}

export const CheckboxHeaderCell = ({
  checked,
  set_checked,
  set_last_selected,
}: {
  checked: boolean[]
  set_checked: (checked: boolean[]) => void
  set_last_selected: (index?: number) => void
}) => (
  <th>
    <input
      className="cursor-pointer"
      type="checkbox"
      onChange={(event) => {
        const new_checked = [...checked]
        new_checked.fill(event.target.checked)
        set_checked(new_checked)
        set_last_selected(undefined)
      }}
    />
  </th>
)
