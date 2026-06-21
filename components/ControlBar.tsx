'use client'

import type { ApiEntry, FilterType, SortKey } from '@/types/api'
import { SearchBar } from './SearchBar'
import { FilterChips } from './FilterChips'
import { SortControl } from './SortControl'

interface ControlBarProps {
  apis: ApiEntry[]
  query: string
  onQueryChange: (v: string) => void
  filter: FilterType
  onFilterChange: (f: FilterType) => void
  sort: SortKey
  onSortChange: (s: SortKey) => void
}

export function ControlBar({
  apis,
  query,
  onQueryChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
}: ControlBarProps) {
  return (
    <div
      className="sticky top-0 z-20 -mx-5 px-5 pt-4 pb-3 sm:-mx-10 sm:px-10 md:-mx-12 md:px-12"
      style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'saturate(140%) blur(8px)',
      }}
    >
      <SearchBar value={query} onChange={onQueryChange} />

      <div className="control-bar mt-3">
        <FilterChips apis={apis} active={filter} onChange={onFilterChange} />
        <div className="ml-auto">
          <SortControl active={sort} onChange={onSortChange} />
        </div>
      </div>
    </div>
  )
}
