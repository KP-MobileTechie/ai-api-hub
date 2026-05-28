'use client'

import { useState } from 'react'
import type { ApiEntry, FilterType } from '@/types/api'
import { ApiCard } from './ApiCard'
import { SearchBar } from './SearchBar'
import { FilterChips } from './FilterChips'
import { filterApis } from '@/lib/filter'

interface Props {
  apis: ApiEntry[]
}

export function ApiGrid({ apis }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = filterApis(apis, query, filter)

  return (
    <>
      <SearchBar value={query} onChange={setQuery} />
      <FilterChips apis={apis} active={filter} onChange={setFilter} />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)', fontFamily: 'Manrope, sans-serif' }}>All APIs</h2>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-3)' }}>Sorted by free tier, then popularity</p>
        </div>
        <span className="text-[13px] font-mono" style={{ color: 'var(--text-3)' }}>
          Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-[15px]" style={{ color: 'var(--text-3)' }}>No APIs match your search</p>
          <span className="text-[13px] mt-1.5 block" style={{ color: 'var(--text-3)' }}>
            Try a different keyword or clear the filters
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(api => <ApiCard key={api.id} api={api} />)}
        </div>
      )}
    </>
  )
}
