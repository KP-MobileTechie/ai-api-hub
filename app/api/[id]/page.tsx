import { notFound } from 'next/navigation'
import Link from 'next/link'
import { loadApis, loadHistory } from '@/lib/data'
import { StatusBadge } from '@/components/StatusBadge'
import { CodeSnippet } from '@/components/CodeSnippet'
import type { ApiEntry } from '@/types/api'

export function generateStaticParams() {
  return loadApis().map(api => ({ id: api.id }))
}

interface Props {
  params: { id: string }
}

export default function ApiDetailPage({ params }: Props) {
  const apis = loadApis()
  const history = loadHistory()
  const api = apis.find((a: ApiEntry) => a.id === params.id)
  if (!api) notFound()

  const apiHistory = history[api.id] ?? []

  return (
    <main className="relative z-10 px-5 sm:px-10 pb-20 max-w-4xl mx-auto pt-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[13px] mb-8"
        style={{ color: 'var(--text-2)', textDecoration: 'none' }}
      >
        Back to all APIs
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="font-extrabold text-[28px] sm:text-[36px] tracking-tight mb-1" style={{ color: 'var(--text)', fontFamily: 'Manrope, sans-serif' }}>
            {api.name}
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>
            {api.category}
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:items-end sm:mt-2">
          <StatusBadge status={api.status} />
          <div className="flex items-center gap-2">
            <a
              href={api.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Get API key →
            </a>
            <a
              href={api.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Documentation
            </a>
          </div>
        </div>
      </div>

      <p className="text-[13px] mb-6" style={{ color: 'var(--text-3)' }}>
        “Get API key” opens {api.name}’s console where you can sign in, claim free credits, and generate your key. “Documentation” shows how to set it up and call the API.
      </p>

      <p className="text-[15px] leading-[1.6] mb-6" style={{ color: 'var(--text-2)' }}>
        {api.description}
      </p>

      <div className={`card-free inline-flex mb-6 ${api.freeTier.available ? '' : 'no-free'}`}>
        {api.freeTier.available ? '❆' : '✕'} {api.freeTier.details}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h3 className="text-[11px] font-mono uppercase tracking-wide mb-3" style={{ color: 'var(--text-3)' }}>Models</h3>
          <div className="flex flex-wrap gap-1.5">
            {api.models.map(m => <span key={m} className="tag">{m}</span>)}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h3 className="text-[11px] font-mono uppercase tracking-wide mb-3" style={{ color: 'var(--text-3)' }}>Details</h3>
          <div className="text-[13px] space-y-1.5" style={{ color: 'var(--text-2)' }}>
            <div><span style={{ color: 'var(--text-3)' }}>Auth: </span>{api.auth}</div>
            {api.status.latencyMs && <div><span style={{ color: 'var(--text-3)' }}>Avg latency: </span>{api.status.latencyMs}ms</div>}
            <div><span style={{ color: 'var(--text-3)' }}>Tags: </span>{api.tags.join(', ')}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-5 mb-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h3 className="font-bold mb-3" style={{ color: 'var(--text)', fontFamily: 'Manrope, sans-serif' }}>Code snippets</h3>
        <CodeSnippet snippets={api.snippets} latencyMs={api.status.latencyMs} />
      </div>

      {apiHistory.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h3 className="font-bold mb-4" style={{ color: 'var(--text)', fontFamily: 'Manrope, sans-serif' }}>Status history (7 days)</h3>
          <div className="flex gap-2 items-end">
            {apiHistory.map(entry => (
              <div key={entry.date} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className="w-full rounded-sm"
                  style={{
                    height: entry.alive && entry.latencyMs ? `${Math.min(40, Math.max(8, entry.latencyMs / 60))}px` : '8px',
                    background: entry.alive ? 'var(--live)' : 'var(--down)',
                    opacity: entry.alive ? 0.8 : 0.5,
                  }}
                  title={entry.alive ? `${entry.latencyMs}ms` : 'Down'}
                />
                <span className="text-[9px] font-mono" style={{ color: 'var(--text-3)' }}>
                  {entry.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
