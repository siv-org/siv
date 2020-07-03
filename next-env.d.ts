/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.mdx' {
  const MDXComponent: import('react').ComponentType
  export default MDXComponent
}
