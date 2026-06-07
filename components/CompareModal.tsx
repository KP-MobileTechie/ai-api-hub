'use client'

import type { ApiEntry } from '@/types/api'
import { StatusBadge } from './StatusBadge'

interface Props {
  apis: ApiEntry[]
  onClose: () => void
}

export function CompareModal({ apis, onClose }: Props) {
  const candidates = apis.filter(a => a.freeTier.available && a.status.alive).slice(0, 4)

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-6 z-50"
      style={{ background: 'rgba(7,6,15,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="compare-modal w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-[20px] p-7"
        style={{ background: '#0d0b1a', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text)', fontFamily: 'Manrope, sans-serif' }}>Compare APIs</h2>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text-3)' }}>Free tier, live APIs side by side</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-lg flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-2)' }}
            aria-label="Close"
          >
            x
          </button>
        </div>

        <div className="compare-grid grid gap-3" style={{ gridTemplateColumns: `repeat(${candidates.length}, 1fr)` }}>
          {candidates.map(api => (
            <div
              key={api.id}
              className="rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm" style={{ color: 'var(--text)', fontFamily: 'Manrope, sans-serif' }}>{api.name}</span>
                <StatusBadge status={api.status} />
              </div>
              {api.status.latencyMs && (
                <div className="text-[11px] font-mono mb-2" style={{ color: 'var(--live)' }}>
                  {api.status.latencyMs}ms avg
                </div>
              )}
              <div className="card-free mb-2">
                {api.freeTier.details}
              </div>
              <p className="text-xs leading-[1.5]" style={{ color: 'var(--text-2)' }}>{api.description}</p>
              <div className="flex gap-1 flex-wrap mt-2">
                {api.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-3)' }}>Click outside to close</p>
      </div>
    </div>
  )
}
