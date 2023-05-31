export const api = (route: string, body?: Record<string, unknown>) =>
  fetch(`/api/${route}`, {
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

/** https://github.com/dsernst/siv/commit/06769538edcb054f26b09f2c6a192dbe1166a39a */
export const vercel60secondTimeout = (route: string, body?: Record<string, unknown>) =>
  fetch(`https://siv-git-better-unlock-error-sivteam.vercel.app/api/election/foobar/admin/unlock`, {
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

/** https://github.com/dsernst/siv-blog/blob/main/pages/api/timeout.ts */
export const vercel10secondTimeout = (route: string, body?: Record<string, unknown>) =>
  fetch(`https://blog.siv.org/api/timeout`, {
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
