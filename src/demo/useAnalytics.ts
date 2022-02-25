import { useEffect } from 'react'
import { api } from 'src/api-helper'

export const useAnalytics = () => {
  useEffect(() => {
    api('load')
  }, [])
}
