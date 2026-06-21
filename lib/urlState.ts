import type { FilterType, SortKey } from '@/types/api'

export interface GridView { query: string; filter: FilterType; sort: SortKey }
export const DEFAULT_VIEW: GridView = { query: '', filter: 'all', sort: 'recommended' }

const SORTS: SortKey[] = ['recommended', 'latency', 'uptime', 'name']

export function encodeView(v: GridView): string {
  const p = new URLSearchParams()
  if (v.query) p.set('q', v.query)
  if (v.filter && v.filter !== 'all') p.set('f', v.filter)
  if (v.sort && v.sort !== 'recommended') p.set('s', v.sort)
  return p.toString()
}

export function decodeView(params: URLSearchParams): GridView {
  const q = params.get('q') ?? ''
  const f = (params.get('f') as FilterType | null) ?? 'all'
  const sRaw = params.get('s') as SortKey | null
  const s = sRaw && SORTS.includes(sRaw) ? sRaw : 'recommended'
  return { query: q, filter: f, sort: s }
}
