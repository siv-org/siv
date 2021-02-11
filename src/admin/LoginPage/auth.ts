import Router from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'

const cookie_name = 'siv-jwt'

export function login() {
  // add cookie
  document.cookie = `${cookie_name}=swr;`
}
export function logout() {
  // delete cookie
  document.cookie = `${cookie_name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

export function useLoginRequired(loggedOut: boolean) {
  // If logged out, redirect to Login Screen
  useEffect(() => {
    if (loggedOut) {
      Router.replace('/login')
    }
  }, [loggedOut])
}

export function useUser() {
  const { data, error, mutate } = useSWR('api_user', mockUserApi)

  const loading = !data && !error
  const loggedOut = error && error.status === 403

  return {
    loading,
    loggedOut,
    mutate,
    user: data,
  }
}

// mock the user api
export const mockUserApi = async () => {
  // sleep 500
  await new Promise((res) => setTimeout(res, 500))

  if (document.cookie.includes(`${cookie_name}=swr`)) {
    // authorized
    return {
      avatar: 'https://github.com/shuding.png',
      name: 'Shu',
    }
  }

  // not authorized
  const error = new Error('Not authorized!')
  error.status = 403
  throw error
}
