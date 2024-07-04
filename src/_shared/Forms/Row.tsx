export const Row = (props: { children?: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div
    {...props}
    style={{
      display: 'flex',
      margin: '1.5rem 0',
      ...props.style,
    }}
  />
)
