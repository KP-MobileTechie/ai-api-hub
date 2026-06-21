import type { ApiEntry, FilterType, SortKey } from '@/types/api'

export function filterApis(apis: ApiEntry[], query: string, filter: FilterType): ApiEntry[] {
  const q = query.toLowerCase()
  return apis.filter(api => {
    const matchSearch =
      !q ||
      api.name.toLowerCase().includes(q) ||
      api.description.toLowerCase().includes(q) ||
      api.tags.some(t => t.toLowerCase().includes(q)) ||
      api.category.toLowerCase().includes(q)

    const matchFilter =
      filter === 'all' ? true :
      filter === 'free' ? api.freeTier.available :
      filter === 'live' ? api.status.alive :
      api.category === filter

    return matchSearch && matchFilter
  })
}

export function sortApis(apis: ApiEntry[], key: SortKey): ApiEntry[] {
  if (key === 'recommended') {
    return apis
  }

  const sorted = [...apis]

  if (key === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }

  // 'latency' and 'uptime': alive first, then ascending latency (nulls last).
  sorted.sort((a, b) => {
    if (a.status.alive !== b.status.alive) {
      return a.status.alive ? -1 : 1
    }
    const la = a.status.latencyMs
    const lb = b.status.latencyMs
    if (la === null && lb === null) return 0
    if (la === null) return 1
    if (lb === null) return -1
    return la - lb
  })
  return sorted
}
