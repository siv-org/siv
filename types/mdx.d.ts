import { ComponentType } from 'react'

declare module '*.mdx' {
  const MDXComponent: ComponentType
  export default MDXComponent
}
