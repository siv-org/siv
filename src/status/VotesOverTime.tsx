import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type ChartDataPoint = { timestamp: number; total: number }

const formatDate = (timestamp: number) =>
  new Date(timestamp)
    .toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', weekday: 'short' })
    .replace(',', '')

const formatTooltipDate = (timestamp: number, resolutionMinutes: number) => {
  const startDate = new Date(timestamp)
  const endDate = new Date(timestamp + resolutionMinutes * 60 * 1000)
  const startFormatted = startDate
    .toLocaleString('en-US', { day: 'numeric', hour: 'numeric', month: 'numeric', weekday: 'short' })
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

      <div className="p-3 bg-white rounded-lg border shadow-sm sm:p-6 border-slate-200">
        <div className="flex flex-col gap-2 justify-between items-center mb-4 sm:flex-row">
          <div className="flex gap-2 items-center text-sm">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span className="text-slate-600">Total Votes</span>
          </div>

          <div
            className="flex gap-2 items-center p-2 rounded-md border cursor-pointer hover:bg-slate-100 border-slate-300"
            onClick={() => setCumulative(!cumulative)}
          >
            <input checked={cumulative} readOnly type="checkbox" />
            <span className="text-slate-600">Cumulative</span>
          </div>

          <div
            className={`flex items-center gap-2 p-2 transition-opacity duration-500 opacity-0 ${
              cumulative ? 'cursor-default' : '!opacity-100 hover:bg-slate-100 rounded-md'}`}
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
          <AreaChart data={chartData} margin={{ bottom: 0, left: -10, right: 8, top: 10 }}>
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
              ticks={
                chartData.length === 0
                  ? []
                  : dayTicks(chartData[0].timestamp, chartData[chartData.length - 1].timestamp)
              }
              type="number"
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => value.toString()}
              width={36}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0].payload as ChartDataPoint
                return (
                  <div className="p-4 bg-white rounded-lg border shadow-lg border-slate-200">
                    <div className="mb-2 text-sm font-semibold text-slate-900">
                      {formatTooltipDate(data.timestamp, resolutionToUse)}
                    </div>
                    <div className="flex gap-4 justify-between text-xs">
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

/** One tick per calendar day (max 7), so date labels don't repeat. */
function dayTicks(min: number, max: number): number[] {
  const ticks: number[] = []
  const cursor = new Date(min)
  cursor.setHours(0, 0, 0, 0)
  if (cursor.getTime() < min) cursor.setDate(cursor.getDate() + 1)
  while (cursor.getTime() <= max) {
    ticks.push(cursor.getTime())
    cursor.setDate(cursor.getDate() + 1)
  }
  if (!ticks.length) return [min]
  if (ticks.length <= 7) return ticks
  const step = Math.ceil(ticks.length / 7)
  return ticks.filter((_, i) => i % step === 0)
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
