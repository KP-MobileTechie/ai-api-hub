import { render, screen, fireEvent } from '@testing-library/react'
import { CompareModal } from '../CompareModal'
import type { ApiEntry } from '@/types/api'

const mk = (over: Partial<ApiEntry>): ApiEntry => ({
  id: over.id ?? 'x',
  name: over.name ?? 'X',
  description: 'desc',
  url: 'https://example.com',
  docsUrl: 'https://example.com/docs',
  category: over.category ?? 'inference',
  models: [],
  freeTier: over.freeTier ?? { available: true, details: 'free' },
  auth: 'api_key',
  status: over.status ?? { alive: true, lastChecked: '', latencyMs: 100 },
  tags: [],
  snippets: { python: '', javascript: '', curl: '' },
})

const apiA = mk({ id: 'a', name: 'Alpha' })
const apiB = mk({ id: 'b', name: 'Beta' })

describe('CompareModal a11y', () => {
  it('closes on Escape and has dialog role', () => {
    const onClose = jest.fn()
    render(<CompareModal apis={[apiA, apiB]} onClose={onClose} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('has an accessible name on the dialog', () => {
    const onClose = jest.fn()
    render(<CompareModal apis={[apiA, apiB]} onClose={onClose} />)
    expect(screen.getByRole('dialog')).toHaveAccessibleName()
  })

  it('focuses the dialog on open', () => {
    const onClose = jest.fn()
    render(<CompareModal apis={[apiA, apiB]} onClose={onClose} />)
    expect(screen.getByRole('dialog')).toHaveFocus()
  })

  it('icon-only close control has an accessible label', () => {
    const onClose = jest.fn()
    render(<CompareModal apis={[apiA, apiB]} onClose={onClose} />)
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })
})
