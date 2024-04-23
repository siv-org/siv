import { useRouter } from 'next/router'

/** Grabs `convention_id` from the router. Blocks `string[]` type */
export const useConventionID = (): { convention_id?: string } => {
  const { convention_id } = useRouter().query

  if (Array.isArray(convention_id)) return {}

  return { convention_id }
}
