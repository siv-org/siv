/* eslint-disable @typescript-eslint/no-explicit-any */
// Based on https://www.jpwilliams.dev/how-to-unpack-the-return-type-of-a-promise-in-typescript

/** A generic type for extracting ReturnType from async functions */
export type AsyncReturnType<T extends (...args: any[]) => any> =
  // if T matches this signature and returns a Promise, extract
  // U (the type of the resolved promise) and use that
  T extends (...args: any[]) => Promise<infer U>
    ? U
    : // ...or if T matches this signature and returns anything else,
    // extract the return value U and use that
    T extends (...args: any[]) => infer U
    ? U
    : // ...or if everything goes to hell, return a `never`
      never
