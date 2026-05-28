'use client'

import { useState } from 'react'
import type { ApiEntry } from '@/types/api'
import { CompareModal } from './CompareModal'

interface Props {
  liveCount: number
  apis: ApiEntry[]
}

export function NavBar({ liveCount, apis }: Props) {
  const [showCompare, setShowCompare] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  function handleBrowse(e: React.MouseEvent) {
    e.preventDefault()
    document.getElementById('api-grid')?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleCategories(e: React.MouseEvent) {
    e.preventDefault()
    document.getElementById('filter-chips')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function handleGitHub() {
    showToast('Opening GitHub repo...')
    setTimeout(() => window.open('https://github.com/yourusername/ai-api-hub', '_blank'), 600)
  }

  return (
    <>
      <nav
        className="sticky top-0 z-40 h-14 flex items-center justify-between px-10"
        style={{ backdropFilter: 'blur(20px)', background: 'rgba(7,6,15,0.75)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2.5 font-bold text-[17px] tracking-tight" style={{ color: 'var(--text)', fontFamily: 'Manrope, sans-serif' }}>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))' }}
          >
            ⚡
          </div>
          AI{' '}
          <span style={{ background: 'linear-gradient(90deg, var(--accent-1), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            API Hub
          </span>
        </div>

        <div className="flex items-center gap-5 text-[13px]">
          <a href="#browse" onClick={handleBrowse} style={{ color: 'var(--text-2)', textDecoration: 'none' }}>Browse</a>
          <a href="#categories" onClick={handleCategories} style={{ color: 'var(--text-2)', textDecoration: 'none' }}>Categories</a>
          <button onClick={() => setShowCompare(true)} className="bg-transparent border-none cursor-pointer text-[13px]" style={{ color: 'var(--text-2)', fontFamily: 'inherit' }}>Compare</button>
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono"
            style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: 'var(--live)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full dot-g" />
            {liveCount} live
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => showToast('Submit API form coming soon')}
            className="text-[13px] bg-transparent border-none cursor-pointer"
            style={{ color: 'var(--text-2)', fontFamily: 'inherit' }}
          >
            Submit API
          </button>
          <button
            onClick={handleGitHub}
            className="text-[13px] font-semibold px-4 py-1.5 rounded-lg border-none cursor-pointer text-white"
            style={{ background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))', fontFamily: 'inherit' }}
          >
            Star on GitHub
          </button>
        </div>
      </nav>

      {showCompare && <CompareModal apis={apis} onClose={() => setShowCompare(false)} />}

      {toast && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl text-[13px] z-50"
          style={{
            background: 'rgba(168,85,247,0.18)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(168,85,247,0.35)',
            color: '#e9d5ff',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
        >
          {toast}
        </div>
      )}
    </>
  )
}
