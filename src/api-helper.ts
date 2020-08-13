export const api = (route: string, body: Record<string, string | string[] | undefined>) =>
  fetch(`/api/${route}`, {
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
