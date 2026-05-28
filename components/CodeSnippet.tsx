'use client'

import { useState } from 'react'
import type { Snippets } from '@/types/api'

type Lang = 'python' | 'javascript' | 'curl'
const TABS: { key: Lang; label: string }[] = [
  { key: 'python', label: 'Python' },
  { key: 'javascript', label: 'JS' },
  { key: 'curl', label: 'cURL' },
]

interface Props {
  snippets: Snippets
  latencyMs: number | null
}

export function CodeSnippet({ snippets, latencyMs }: Props) {
  const [active, setActive] = useState<Lang>('python')

  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="flex items-center gap-1.5 mb-2">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`snippet-btn ${active === tab.key ? 'active' : ''}`}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        <span className="ml-auto text-[10px] font-mono" style={{ color: latencyMs ? 'var(--text-3)' : 'var(--down)' }}>
          {latencyMs ? `${latencyMs}ms avg` : 'last seen 6h ago'}
        </span>
      </div>
      <pre
        className="rounded-lg p-3 text-[10.5px] leading-relaxed overflow-x-auto max-h-28"
        style={{
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.05)',
          color: '#b4c6ef',
          fontFamily: 'IBM Plex Mono, monospace',
          whiteSpace: 'pre',
        }}
      >
        {snippets[active]}
      </pre>
    </div>
  )
}
