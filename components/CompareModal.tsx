'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import type { ApiEntry } from '@/types/api'
import { StatusBadge } from './StatusBadge'

interface Props {
  apis: ApiEntry[]
  onClose: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  inference: 'Chat / LLM',
  embeddings: 'Embeddings',
  'image-gen': 'Image',
  speech: 'Speech',
  code: 'Code',
  multimodal: 'Multimodal',
  vision: 'Vision',
}

const DASH = '—'

export function CompareModal({ apis, onClose }: Props) {
  // The tray passes the user-selected APIs directly. Fall back to free + live
  // candidates when invoked without an explicit selection (legacy entry point).
  const explicit = apis.length > 0 && apis.length <= 3
  const candidates = (explicit ? apis : apis.filter(a => a.freeTier.available && a.status.alive)).slice(0, 4)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Escape-to-close + restore focus to the opener on unmount.
  useEffect(() => {
    const opener = (typeof document !== 'undefined' ? document.activeElement : null) as HTMLElement | null
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    // Move focus into the dialog on open.
    dialogRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      opener?.focus?.()
    }
  }, [onClose])

  const list = (arr: string[] | undefined) => (arr && arr.length ? arr.join(', ') : DASH)
  const val = (v: string | null | undefined) => (v != null && v !== '' ? v : DASH)

  // Each row is a decision dimension; renderer receives the API for that column.
  const rows: { label: string; render: (api: ApiEntry) => ReactNode }[] = [
    {
      label: 'Category',
      render: api => CATEGORY_LABELS[api.category] ?? api.category,
    },
    {
      label: 'Status',
      render: api => <StatusBadge status={api.status} />,
    },
    {
      label: 'Avg latency',
      render: api => (
        api.status.latencyMs != null
          ? <span className="font-mono" style={{ color: 'var(--live)' }}>{api.status.latencyMs}ms</span>
          : DASH
      ),
    },
    {
      label: 'Free tier',
      render: api => (api.freeTier.available ? (val(api.freeTier.details) === DASH ? 'Yes' : api.freeTier.details) : 'No'),
    },
    { label: 'Pricing', render: api => val(api.pricing) },
    { label: 'Rate limit', render: api => val(api.rateLimit) },
    { label: 'Free credits', render: api => val(api.freeCredits) },
    { label: 'Auth', render: api => val(api.auth) },
    { label: 'SDK languages', render: api => list(api.sdkLanguages) },
    { label: 'Regions', render: api => list(api.regions) },
    { label: 'Models', render: api => list(api.models) },
  ]

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-6 z-50"
      style={{ background: 'rgba(7,6,15,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Compare APIs"
        tabIndex={-1}
        className="compare-modal w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-[20px] p-7 outline-none"
        style={{ background: '#0d0b1a', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text)', fontFamily: 'Manrope, sans-serif' }}>Compare APIs</h2>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text-3)' }}>Side by side across every decision dimension</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-2)' }}
            aria-label="Close"
          >
            x
          </button>
        </div>

        <div className="overflow-x-auto -mx-1 px-1">
          <table className="compare-table w-full border-collapse text-left" style={{ minWidth: `${160 + candidates.length * 180}px` }}>
            <thead>
              <tr>
                <th
                  className="sticky left-0 z-10 py-3 pr-4 align-bottom text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-3)', background: '#0d0b1a' }}
                  scope="col"
                >
                  Dimension
                </th>
                {candidates.map(api => (
                  <th
                    key={api.id}
                    scope="col"
                    className="py-3 px-4 align-bottom"
                  >
                    <span className="font-bold text-sm" style={{ color: 'var(--text)', fontFamily: 'Manrope, sans-serif' }}>{api.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: i % 2 ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 py-3 pr-4 align-top text-[12px] font-medium whitespace-nowrap"
                    style={{ color: 'var(--text-3)', background: i % 2 ? '#100e1f' : '#0d0b1a' }}
                  >
                    {row.label}
                  </th>
                  {candidates.map(api => (
                    <td
                      key={api.id}
                      className="py-3 px-4 align-top text-[12.5px] leading-[1.5]"
                      style={{ color: 'var(--text-2)' }}
                    >
                      {row.render(api)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: 'var(--text-3)' }}>Press Escape or click outside to close</p>
      </div>
    </div>
  )
}
