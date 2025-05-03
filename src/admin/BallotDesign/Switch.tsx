export const Switch = ({
  checked,
  label,
  labelClassName,
  onClick,
}: {
  checked: boolean
  label: string
  labelClassName?: string
  onClick: () => void
}) => {
  return (
    <span {...{ onClick }}>
      <input
        className="relative top-2.5 border-solid border border-neutral-400/60 h-[22px] w-[38px] appearance-none rounded-full bg-neutral-100 after:absolute after:z-[2] after:h-[18px] after:w-[18px] after:rounded-full after:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.6)] after:bg-neutral-50 after:ml-px after:mt-px after:transition-[transform_0.2s] after:content-[''] transition-[background-color_0.2s] checked:bg-[#009319] checked:after:ml-[17px] focus:outline-none focus:ring-0 cursor-pointer"
        id={`switch-${label}`}
        readOnly
        role="switch"
        type="checkbox"
        {...{ checked }}
      />
      <label
        className={`pl-[0.15rem] relative bottom-0.5 cursor-pointer ${labelClassName}`}
        htmlFor={`switch-${label}`}
        {...{ onClick }}
      >
        {label}
      </label>
    </span>
  )
}
