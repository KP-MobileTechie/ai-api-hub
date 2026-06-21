'use client'

import type { SortKey } from '@/types/api'

interface Props {
  active: SortKey
  onChange: (key: SortKey) => void
}

const OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'latency', label: 'Fastest' },
  { key: 'uptime', label: 'Uptime' },
  { key: 'name', label: 'Name' },
]

export function SortControl({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {OPTIONS.map(opt => (
        <button
          key={opt.key}
          className={`chip ${active === opt.key ? 'active' : ''}`}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
