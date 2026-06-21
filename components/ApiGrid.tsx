'use client'

import { useEffect, useRef, useState } from 'react'
import type { ApiEntry, FilterType, SortKey, Category } from '@/types/api'
import { ApiCard } from './ApiCard'
import { ControlBar } from './ControlBar'
import { UseCasePicker } from './UseCasePicker'
import { ComparisonTray } from './ComparisonTray'
import { CompareModal } from './CompareModal'
import { filterApis, sortApis } from '@/lib/filter'
import { recommend } from '@/lib/recommend'
import { encodeView, decodeView } from '@/lib/urlState'

const MAX_COMPARE = 3

interface Props {
  apis: ApiEntry[]
}

export function ApiGrid({ apis }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortKey>('recommended')
  const [useCase, setUseCase] = useState<Category | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)

  // Track whether the initial URL hydration has run so we don't write the
  // default view back to the URL before reading from it (SSR-guarded).
  const hydrated = useRef(false)

  // On mount, initialize query/filter/sort from the URL search params.
  useEffect(() => {
    const view = decodeView(new URLSearchParams(window.location.search))
    setQuery(view.query)
    setFilter(view.filter)
    setSort(view.sort)
    hydrated.current = true
  }, [])

  // On any change, mirror the view into the URL via replaceState (no history push).
  useEffect(() => {
    if (!hydrated.current) return
    const encoded = encodeView({ query, filter, sort })
    const url = encoded ? '?' + encoded : window.location.pathname
    window.history.replaceState(null, '', url)
  }, [query, filter, sort])

  function toggleCompare(id: string) {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length >= MAX_COMPARE
          ? prev
          : [...prev, id],
    )
  }

  const selected = apis.filter(a => selectedIds.includes(a.id))

  // When a use case is active, surface the ranked shortlist; otherwise use the
  // existing search/filter/sort pipeline.
  const filtered = useCase
    ? recommend(apis, useCase).map(s => s.api)
    : sortApis(filterApis(apis, query, filter), sort)

  const useCaseLabel = useCase
    ? useCase.charAt(0).toUpperCase() + useCase.slice(1).replace('-', ' ')
    : null

  return (
    <>
      <UseCasePicker apis={apis} active={useCase} onPick={setUseCase} />

      {!useCase && (
        <ControlBar
          apis={apis}
          query={query}
          onQueryChange={setQuery}
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
        />
      )}

      <div className="flex items-center justify-between mb-5 mt-5">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)', fontFamily: 'Manrope, sans-serif' }}>
            {useCaseLabel ? `Recommended for ${useCaseLabel}` : 'All APIs'}
          </h2>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-3)' }}>
            {useCaseLabel ? 'Ranked by uptime, latency, and free tier' : 'Sorted by free tier, then popularity'}
          </p>
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
          {filtered.map(api => (
            <ApiCard
              key={api.id}
              api={api}
              selected={selectedIds.includes(api.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>
      )}

      <ComparisonTray
        selected={selected}
        onRemove={toggleCompare}
        onClear={() => setSelectedIds([])}
        onCompare={() => setShowCompare(true)}
      />

      {showCompare && (
        <CompareModal apis={selected} onClose={() => setShowCompare(false)} />
      )}
    </>
  )
}
