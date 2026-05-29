import type { ApiEntry } from '@/types/api'
import { StatusBadge } from './StatusBadge'
import { CodeSnippet } from './CodeSnippet'

interface Props {
  api: ApiEntry
}

export function ApiCard({ api }: Props) {
  const statusClass = api.status.alive ? 'is-live' : 'is-down'

  return (
    <div className={`api-card ${statusClass}`}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '15px',
            letterSpacing: '-0.3px',
            color: 'var(--text)',
            lineHeight: 1.2,
          }}>
            {api.name}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9.5px',
            color: 'var(--text-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginTop: '3px',
          }}>
            {api.category}
          </div>
        </div>
        <div style={{ flexShrink: 0, marginLeft: '10px' }}>
          <StatusBadge status={api.status} />
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize: '12.5px',
        lineHeight: '1.55',
        color: 'var(--text-2)',
        marginBottom: '14px',
        fontFamily: 'var(--font-body)',
      }}>
        {api.description}
      </p>

      {/* Free tier */}
      <div className={`card-free ${api.freeTier.available ? '' : 'no-free'}`}>
        <span style={{ opacity: 0.7, fontSize: '10px' }}>{api.freeTier.available ? '✦' : '✕'}</span>
        {api.freeTier.details}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {api.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {/* Code snippet */}
      <CodeSnippet snippets={api.snippets} latencyMs={api.status.latencyMs} />
    </div>
  )
}
