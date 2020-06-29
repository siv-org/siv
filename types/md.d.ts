import { Props } from 'react'

declare module '*.md' {
  let MDComponent: (props: Props) => JSX.Element
  export default MDComponent
}
