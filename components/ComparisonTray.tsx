'use client'

import type { ApiEntry } from '@/types/api'

interface ComparisonTrayProps {
  selected: ApiEntry[]
  onRemove: (id: string) => void
  onClear: () => void
  onCompare: () => void
}

export function ComparisonTray({ selected, onRemove, onClear, onCompare }: ComparisonTrayProps) {
  if (selected.length === 0) return null

  const canCompare = selected.length >= 2

  return (
    <div
      role="region"
      aria-label="Comparison tray"
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pointer-events-none"
    >
      <div
        className="pointer-events-auto mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-xl p-3 sm:flex-row sm:items-center sm:gap-3"
        style={{
          background: 'rgba(13,11,26,0.92)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
          <span
            className="shrink-0 font-mono text-[10px] uppercase tracking-wider"
            style={{ color: 'var(--text-3)' }}
          >
            Compare ({selected.length}/3)
          </span>
          <div className="flex items-center gap-2">
            {selected.map(api => (
              <span
                key={api.id}
                className="metric-pill"
                style={{ color: 'var(--accent-bright)', borderColor: 'var(--accent)' }}
              >
                {api.name}
                <button
                  type="button"
                  onClick={() => onRemove(api.id)}
                  aria-label={`Remove ${api.name} from comparison`}
                  className="ml-1 flex h-4 w-4 items-center justify-center rounded-full leading-none"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-2)' }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="btn btn-secondary"
            aria-label="Clear comparison selection"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onCompare}
            disabled={!canCompare}
            className="btn btn-primary"
            aria-label="Compare selected APIs"
            style={!canCompare ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
          >
            Compare {selected.length}
          </button>
        </div>
      </div>
    </div>
  )
}
