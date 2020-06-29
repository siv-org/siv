import { Props } from 'react'

declare module '*.mdx' {
  let MDXComponent: (props: Props) => JSX.Element
  export default MDXComponent
}
