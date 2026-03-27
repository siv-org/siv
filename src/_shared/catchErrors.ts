/** Simpler async try/catch error handling.

@example
```ts
const [result, error] = await catchErrors(someAsyncFunction())
if (error) return console.error('someAsyncFunction() Error:', error)

// ... rest of your logic
const { destructuredVal, anotherVal } = result
```
*/
export async function catchErrors<T>(promise: Promise<T>): Promise<[null, Error] | [T, null]> {
  try {
    const result = await promise
    // Success case
    return [result, null]
  } catch (error: unknown) {
    // Error case
    if (error instanceof Error) {
      console.warn('catchErrors() caught error:', error)
      return [null, error]
    }

    // Other, unknown case
    console.warn('catchErrors() caught an unexpected issue:', error)
    return [null, new Error('An unexpected error occurred')]
  }
}
