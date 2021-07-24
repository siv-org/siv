export const api = (route: string, body?: Record<string, unknown>) =>
  fetch(`/api/${route}`, {
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

export const fetcher = (url: string) =>
  fetch(url).then(async (r) => {
    if (!r.ok) throw await r.json()
    return await r.json()
  })
