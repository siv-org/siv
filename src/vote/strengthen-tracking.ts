/** Add voter-chosen 4 digits into the last group of a ####-####-#### verification number. */
export function strengthenTracking(deviceTracking: string, voterDigits: string): string {
  const parts = deviceTracking.replace(/\D/g, '').padStart(12, '0').slice(0, 12)
  const add = Number(voterDigits.replace(/\D/g, '').slice(0, 4).padStart(4, '0'))
  const sum = String((Number(parts.slice(8, 12)) + add) % 10_000).padStart(4, '0')
  return `${parts.slice(0, 4)}-${parts.slice(4, 8)}-${sum}`
}
