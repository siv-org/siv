import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type ChartDataPoint = { timestamp: number; total: number }

const formatDate = (timestamp: number) =>
  new Date(timestamp)
    .toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })
    .replace(',', '')

const formatTooltipDate = (timestamp: number, resolutionMinutes: number) => {
  const startDate = new Date(timestamp)
  const endDate = new Date(timestamp + resolutionMinutes * 60 * 1000)
  const startFormatted = startDate
    .toLocaleString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric', hour: 'numeric' })
    .replace(' AM', 'a')
    .replace(' PM', 'p')
    .replaceAll(',', '')

  const daily = 60 * 24
  if (resolutionMinutes === daily) return startFormatted.split(' ').slice(0, 2).join(' ')

  const endTime = endDate.toLocaleString('en-US', { hour: 'numeric' }).split(' ')[0]
  const parts = startFormatted.split(' ')
  const datePart = parts.slice(0, 2).join(' ')
  const startTime = parts.at(-1)
  return `${datePart} ${startTime}-${endTime}`
}

export function VotesOverTime({ submitted_at }: { submitted_at: string[] }) {
  const [cumulative, setCumulative] = useState(true)
  const [resolution, setResolution] = useState(60 * 3)
  const resolutionToUse = cumulative ? 60 : resolution

  const chartData = useMemo(
    () => getChartData(submitted_at, cumulative, resolutionToUse),
    [submitted_at, cumulative, resolutionToUse],
  )

  return (
    <div className="mt-8">
      <h3 className="mb-6 text-xl font-semibold">Votes over time</h3>

      <div className="p-6 bg-white border rounded-lg shadow-sm border-slate-200">
        <div className="flex flex-col items-center justify-between gap-2 mb-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span className="text-slate-600">Total Votes</span>
          </div>

          <div
            className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-slate-100 border-slate-300"
            onClick={() => setCumulative(!cumulative)}
          >
            <input checked={cumulative} readOnly type="checkbox" />
            <span className="text-slate-600">Cumulative</span>
          </div>

          <div
            className={`flex items-center gap-2 p-2 transition-opacity duration-500 opacity-0 ${
              cumulative ? 'cursor-default' : '!opacity-100 hover:bg-slate-100 rounded-md'
            }`}
          >
            Resolution:
            <select disabled={cumulative} onChange={(e) => setResolution(Number(e.target.value))} value={resolution}>
              <option value={60}>1 hour</option>
              <option value={60 * 3}>3 hours</option>
              <option value={60 * 8}>8 hours</option>
              <option value={60 * 24}>Daily</option>
            </select>
          </div>
        </div>

        <ResponsiveContainer height={400} width="100%">
          <AreaChart data={chartData} margin={{ bottom: 0, left: 0, right: 30, top: 10 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              domain={['dataMin', 'dataMax']}
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              tickFormatter={formatDate}
              ticks={(() => {
                if (chartData.length === 0) return []
                const min = chartData[0].timestamp
                const max = chartData[chartData.length - 1].timestamp
                const tickCount = 7
                const tickInterval = (max - min) / (tickCount - 1)
                return Array.from({ length: tickCount }, (_, i) => Math.round(min + i * tickInterval))
              })()}
              type="number"
            />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} tickFormatter={(value) => value.toString()} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0].payload as ChartDataPoint
                return (
                  <div className="p-4 bg-white border rounded-lg shadow-lg border-slate-200">
                    <div className="mb-2 text-sm font-semibold text-slate-900">
                      {formatTooltipDate(data.timestamp, resolutionToUse)}
                    </div>
                    <div className="flex justify-between gap-4 text-xs">
                      <span className="text-slate-600">Total Votes:</span>
                      <span className="font-semibold text-blue-600">{data.total}</span>
                    </div>
                  </div>
                )
              }}
            />
            <Area
              dataKey="total"
              fill="url(#colorTotal)"
              fillOpacity={1}
              name="Total Votes"
              stroke="#3b82f6"
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function getChartData(submitted_at: string[], cumulative: boolean, resolution: number): ChartDataPoint[] {
  const votes = submitted_at
    .map((iso) => {
      const timestamp = new Date(iso)
      return isNaN(timestamp.getTime()) ? null : timestamp
    })
    .filter((v): v is Date => !!v)

  const buckets = new Map<number, number>()
  votes.forEach((timestamp) => {
    const daily = 60 * 24
    let bucketStart: number
    if (resolution === daily) {
      bucketStart = new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate(), 0, 0, 1).getTime()
    } else {
      const resMs = resolution * 60 * 1000
      bucketStart = Math.floor(timestamp.getTime() / resMs) * resMs
    }
    buckets.set(bucketStart, (buckets.get(bucketStart) || 0) + 1)
  })

  let running = 0
  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([timestamp, count]) => {
      if (!cumulative) running = 0
      running += count
      return { timestamp, total: running }
    })
}
