import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../StatusBadge'
import type { ApiStatus } from '@/types/api'

const liveStatus: ApiStatus = { alive: true, lastChecked: '2026-05-29T06:00:00Z', latencyMs: 210 }
const downStatus: ApiStatus = { alive: false, lastChecked: '2026-05-29T06:00:00Z', latencyMs: null }

describe('StatusBadge', () => {
  it('shows Live when alive is true', () => {
    render(<StatusBadge status={liveStatus} />)
    expect(screen.getByText('Live')).toBeInTheDocument()
  })

  it('shows Down when alive is false', () => {
    render(<StatusBadge status={downStatus} />)
    expect(screen.getByText('Down')).toBeInTheDocument()
  })

  it('applies status-live class when alive', () => {
    const { container } = render(<StatusBadge status={liveStatus} />)
    expect(container.firstChild).toHaveClass('status-live')
  })

  it('applies status-down class when down', () => {
    const { container } = render(<StatusBadge status={downStatus} />)
    expect(container.firstChild).toHaveClass('status-down')
  })

  it('has a pulsing dot when alive', () => {
    const { container } = render(<StatusBadge status={liveStatus} />)
    expect(container.querySelector('.dot-g')).toBeInTheDocument()
  })
})
