import { render, screen, fireEvent } from '@testing-library/react'
import { FilterChips } from '../FilterChips'
import type { ApiEntry } from '@/types/api'

const apis: ApiEntry[] = [
  { id: 'a', name: 'A', description: '', url: '', docsUrl: '', category: 'inference', models: [], freeTier: { available: true, details: '' }, auth: '', status: { alive: true, lastChecked: '', latencyMs: null }, tags: [], snippets: { python: '', javascript: '', curl: '' } },
  { id: 'b', name: 'B', description: '', url: '', docsUrl: '', category: 'embeddings', models: [], freeTier: { available: false, details: '' }, auth: '', status: { alive: false, lastChecked: '', latencyMs: null }, tags: [], snippets: { python: '', javascript: '', curl: '' } },
]

describe('FilterChips', () => {
  it('renders All chip as active by default', () => {
    render(<FilterChips apis={apis} active="all" onChange={() => {}} />)
    const allChip = screen.getAllByText(/^All/)[0]
    expect(allChip.closest('button')).toHaveClass('active')
  })

  it('calls onChange when a chip is clicked', () => {
    const onChange = jest.fn()
    render(<FilterChips apis={apis} active="all" onChange={onChange} />)
    fireEvent.click(screen.getByText(/^Free tier/))
    expect(onChange).toHaveBeenCalledWith('free')
  })

  it('shows total count on All chip', () => {
    render(<FilterChips apis={apis} active="all" onChange={() => {}} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
