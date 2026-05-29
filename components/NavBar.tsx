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
    setTimeout(() => window.open('https://github.com/KP-MobileTechie/ai-api-hub', '_blank'), 600)
  }

  const navLinkStyle = {
    color: 'var(--text-2)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0.01em',
    transition: 'color 0.15s',
    padding: '4px 0',
    position: 'relative' as const,
  }

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 48px',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          background: 'rgba(7,6,15,0.8)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 1px 0 0 rgba(168,85,247,0.06)',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
            background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
            boxShadow: '0 0 16px rgba(168,85,247,0.4)',
            flexShrink: 0,
          }}>
            ⚡
          </div>
          <span style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: '18px',
            letterSpacing: '-0.5px',
            color: 'var(--text)',
          }}>
            AI{' '}
            <span style={{
              background: 'linear-gradient(90deg, var(--accent-1), var(--accent-2))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              API Hub
            </span>
          </span>
        </div>

        {/* Center nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          <a href="#browse" onClick={handleBrowse} style={navLinkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
          >
            Browse
          </a>
          <a href="#categories" onClick={handleCategories} style={navLinkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
          >
            Categories
          </a>
          <button
            onClick={() => setShowCompare(true)}
            style={{ ...navLinkStyle, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
          >
            Compare
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(52,211,153,0.07)',
            border: '1px solid rgba(52,211,153,0.18)',
            borderRadius: '20px',
            padding: '5px 12px',
            fontSize: '12px',
            fontFamily: 'IBM Plex Mono, monospace',
            color: 'var(--live)',
          }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: 'var(--live)',
              animation: 'glow-pulse 2s ease-in-out infinite',
            }} />
            {liveCount} live
          </div>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => showToast('Submit API form coming soon')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: 500,
              color: 'var(--text-2)', fontFamily: 'inherit',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
          >
            Submit API
          </button>

          <button
            onClick={handleGitHub}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              fontSize: '14px', fontWeight: 600,
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none', cursor: 'pointer',
              color: '#fff',
              fontFamily: 'inherit',
              background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
              boxShadow: '0 0 20px rgba(168,85,247,0.25)',
              transition: 'opacity 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.9'
              e.currentTarget.style.boxShadow = '0 0 28px rgba(168,85,247,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(168,85,247,0.25)'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Star on GitHub
          </button>
        </div>
      </nav>

      {showCompare && <CompareModal apis={apis} onClose={() => setShowCompare(false)} />}

      {toast && (
        <div style={{
          position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          padding: '10px 20px', borderRadius: '12px',
          fontSize: '13px', zIndex: 50,
          background: 'rgba(168,85,247,0.15)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(168,85,247,0.3)',
          color: '#e9d5ff',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          {toast}
        </div>
      )}
    </>
  )
}
