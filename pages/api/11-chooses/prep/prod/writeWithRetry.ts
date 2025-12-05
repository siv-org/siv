import { firestore } from 'firebase-admin'

const transientCodes = new Set(['aborted', 'deadline-exceeded', 'resource-exhausted', 'unavailable'])

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Retry helper */
export const writeWithRetry = async <T>(ref: firestore.DocumentReference<T>, data: T, maxAttempts = 5) => {
  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await ref.set(data)
      return
    } catch (err: unknown) {
      lastError = err

      const code = (err as { code?: string }).code
      const isTransient = code && transientCodes.has(code)

      if (!isTransient || attempt === maxAttempts) throw err

      const backoffMs = Math.pow(2, attempt) * 100 + Math.random() * 100
      await sleep(backoffMs)
    }
  }

  throw lastError
}
