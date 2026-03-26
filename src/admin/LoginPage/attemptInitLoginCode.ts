import router from 'next/router'
import { api } from 'src/api-helper'

const adminInitKey = 'siv-admin-init'

export async function attemptInitLoginCode() {
  const initCode = localStorage.getItem(adminInitKey)
  if (!initCode) return
  const response = await api('admin-use-init-code', JSON.parse(initCode))

  if (response.status === 400) return console.error(await response.json())
  if (response.status === 204) return

  localStorage.removeItem(adminInitKey)
  if (response.status === 200) await router.push('./admin')
}
