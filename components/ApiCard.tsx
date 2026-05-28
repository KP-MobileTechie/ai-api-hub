import type { ApiEntry } from '@/types/api'
import { StatusBadge } from './StatusBadge'
import { CodeSnippet } from './CodeSnippet'

interface Props {
  api: ApiEntry
}

export function ApiCard({ api }: Props) {
  return (
    <div className="api-card">
      <div className="flex justify-between items-start mb-2.5">
        <div>
          <div className="font-bold text-[15px] tracking-tight" style={{ color: 'var(--text)', fontFamily: 'Manrope, sans-serif' }}>
            {api.name}
          </div>
          <div className="text-[10px] uppercase tracking-wide mt-0.5 font-mono" style={{ color: 'var(--text-3)' }}>
            {api.category}
          </div>
        </div>
        <StatusBadge status={api.status} />
      </div>

      <p className="text-[13px] leading-[1.5] mb-3" style={{ color: 'var(--text-2)' }}>
        {api.description}
      </p>

      <div className={`card-free ${api.freeTier.available ? '' : 'no-free'}`}>
        {api.freeTier.available ? '❆' : '✕'} {api.freeTier.details}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {api.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <CodeSnippet snippets={api.snippets} latencyMs={api.status.latencyMs} />
    </div>
  )
}
