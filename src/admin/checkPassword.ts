export function checkPassword() {
  if (typeof localStorage === 'undefined') return

  if (!localStorage.password || localStorage.password === 'null') {
    localStorage.password = prompt('Admin password?')
  }

  return true
}
