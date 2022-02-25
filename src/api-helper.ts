export const api = (route: string, body?: Record<string, unknown>, keepalive?: boolean) =>
  fetch(`/api/${route}`, {
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    keepalive,
    method: 'POST',
  })
