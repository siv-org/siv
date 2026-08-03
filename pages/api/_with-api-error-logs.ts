import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

/** Log 4xx/5xx response bodies to stdout (visible in Vercel runtime logs). */
export function withApiErrorLogs(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const path = req.url
    const origJson = res.json.bind(res)
    const origSend = res.send.bind(res)
    const origEnd = res.end.bind(res)

    let logged = false
    const logIfError = (body?: unknown) => {
      if (res.statusCode < 400) return
      if (logged) return // only log the outermost call once
      logged = true // otherwise json() calls send() then end()— triple log
      console.error(path, res.statusCode, body ?? '')
    }

    res.json = (body) => {
      logIfError(body)
      return origJson(body)
    }
    res.send = (body) => {
      logIfError(body)
      return origSend(body)
    }
    // Some routes only set status + end()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.end = ((...args: any[]) => {
      if (!res.writableEnded) logIfError(args[0])
      return origEnd(...args)
    }) as typeof res.end

    return handler(req, res)
  }
}
