import type { ApiEntry, FilterType } from '@/types/api'

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
