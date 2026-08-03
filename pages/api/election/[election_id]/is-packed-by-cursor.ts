export type TimestampLike = Date | null | undefined | { toMillis: () => number }

const toMillis = (t: TimestampLike) => {
  if (!t) return 0
  if (t instanceof Date) return t.getTime()
  return t.toMillis()
}

/** True if (created_at, docId) is at or before the pack cursor — already in a cached page. */
export function isPackedByCursor(
  created_at: TimestampLike,
  docId: string,
  lastPackedCreatedAt: null | undefined | { toMillis: () => number },
  lastPackedDocId: null | string | undefined,
): boolean {
  if (!lastPackedCreatedAt || !lastPackedDocId) return false
  const t = toMillis(created_at)
  const packedT = lastPackedCreatedAt.toMillis()
  if (t < packedT) return true
  if (t > packedT) return false
  return docId <= lastPackedDocId
}
