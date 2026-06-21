import type { HistoryEntry } from '@/types/api'

export interface UptimeSummary {
  uptimePct: number | null
  avgLatencyMs: number | null
  sampleDays: number
}

export function computeUptime(history: HistoryEntry[]): UptimeSummary {
  const total = history.length
  if (total === 0) {
    return { uptimePct: null, avgLatencyMs: null, sampleDays: 0 }
  }

  const aliveEntries = history.filter((entry) => entry.alive)
  const uptimePct = Math.round((100 * aliveEntries.length) / total)

  const latencies = aliveEntries
    .map((entry) => entry.latencyMs)
    .filter((latency): latency is number => latency !== null)

  const avgLatencyMs =
    latencies.length > 0
      ? Math.round(latencies.reduce((sum, ms) => sum + ms, 0) / latencies.length)
      : null

  return { uptimePct, avgLatencyMs, sampleDays: total }
}

export function formatRelative(iso: string, nowIso: string): string {
  const diffMs = new Date(nowIso).getTime() - new Date(iso).getTime()
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
