import { useRouter } from 'next/router'

export const useConventionID = () => {
  const { convention_id } = useRouter().query

  // Return `string` convention_id or undefined
  return {
    convention_id: typeof convention_id === 'string' ? convention_id : undefined,
  }
}
