'use client'

import type { ApiEntry, FilterType, Category } from '@/types/api'

const CATEGORIES: Category[] = ['inference', 'embeddings', 'image-gen', 'speech', 'code', 'multimodal', 'vision']

interface Props {
  apis: ApiEntry[]
  active: FilterType
  onChange: (filter: FilterType) => void
}

export function FilterChips({ apis, active, onChange }: Props) {
  const counts = {
    all: apis.length,
    free: apis.filter(a => a.freeTier.available).length,
    live: apis.filter(a => a.status.alive).length,
  }

  const chips: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'free', label: 'Free tier', count: counts.free },
    { key: 'live', label: 'Live only', count: counts.live },
    ...CATEGORIES
      .filter(cat => apis.some(a => a.category === cat))
      .map(cat => ({
        key: cat as FilterType,
        label: cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' '),
        count: apis.filter(a => a.category === cat).length,
      })),
  ]

  return (
    <div id="filter-chips" className="flex items-center gap-2 flex-wrap py-7">
      {chips.map(chip => (
        <button
          key={chip.key}
          className={`chip ${active === chip.key ? 'active' : ''}`}
          onClick={() => onChange(chip.key)}
        >
          {chip.label}{' '}
          <span
            className="rounded-full px-1.5 py-px text-[10px] ml-1"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-3)' }}
          >
            {chip.count}
          </span>
        </button>
      ))}
    </div>
  )
}
