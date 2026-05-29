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
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(snippets[active])
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = snippets[active]
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
      {/* Tab row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`snippet-btn ${active === tab.key ? 'active' : ''}`}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        <span style={{
          marginLeft: 'auto',
          fontSize: '10px',
          fontFamily: 'IBM Plex Mono, monospace',
          color: latencyMs ? 'var(--text-3)' : 'var(--down)',
        }}>
          {latencyMs ? `${latencyMs}ms avg` : 'last seen 6h ago'}
        </span>
      </div>

      {/* Code block with copy button */}
      <div style={{ position: 'relative' }}>
        <pre className="snippet-pre" style={{
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          padding: '12px 14px',
          paddingRight: '52px',
          fontSize: '10.5px',
          lineHeight: '1.65',
          color: '#b4c6ef',
          fontFamily: 'IBM Plex Mono, monospace',
          whiteSpace: 'pre',
          overflow: 'auto',
          maxHeight: '118px',
          margin: 0,
        }}>
          {snippets[active]}
        </pre>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          title="Copy to clipboard"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '6px',
            border: `1px solid ${copied ? 'rgba(52,211,153,0.35)' : 'rgba(255,255,255,0.1)'}`,
            background: copied ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.06)',
            color: copied ? 'var(--live)' : 'var(--text-3)',
            fontSize: '10px',
            fontFamily: 'IBM Plex Mono, monospace',
            cursor: 'pointer',
            transition: 'all 0.15s',
            backdropFilter: 'blur(8px)',
          }}
        >
          {copied ? (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  )
}
