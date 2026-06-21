'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'aah:favorites'

interface Props {
  apiId: string
}

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function FavoriteButton({ apiId }: Props) {
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    setMounted(true)
    setActive(readFavorites().includes(apiId))
  }, [apiId])

  function toggle() {
    const favorites = readFavorites()
    const next = favorites.includes(apiId)
      ? favorites.filter((id) => id !== apiId)
      : [...favorites, apiId]
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore write failures (private mode, quota) */
    }
    setActive(next.includes(apiId))
  }

  // Render a stable, inert star before mount to avoid SSR/hydration mismatch.
  const isActive = mounted && active

  return (
    <button
      type="button"
      className={`fav-btn ${isActive ? 'is-fav' : ''}`}
      onClick={toggle}
      disabled={!mounted}
      aria-pressed={isActive}
      title={isActive ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={isActive ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isActive ? '★' : '☆'}
    </button>
  )
}
