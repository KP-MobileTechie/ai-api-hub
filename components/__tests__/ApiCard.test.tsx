import { render, screen } from '@testing-library/react'
import { ApiCard } from '../ApiCard'
import type { ApiEntry } from '@/types/api'

const api: ApiEntry = {
  id: 'groq',
  name: 'Groq',
  description: 'Fast inference.',
  url: 'https://console.groq.com',
  docsUrl: 'https://console.groq.com/docs',
  category: 'inference',
  models: ['llama3-8b'],
  freeTier: { available: true, details: '14,400 req/day' },
  auth: 'api_key',
  status: { alive: true, lastChecked: '2026-05-29T06:00:00Z', latencyMs: 210 },
  tags: ['fast', 'llm'],
  snippets: { python: 'print(1)', javascript: 'console.log(1)', curl: 'curl ...' },
}

describe('ApiCard', () => {
  it('renders the API name', () => {
    render(<ApiCard api={api} />)
    expect(screen.getByText('Groq')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<ApiCard api={api} />)
    expect(screen.getByText('Fast inference.')).toBeInTheDocument()
  })

  it('renders all tags', () => {
    render(<ApiCard api={api} />)
    expect(screen.getByText('fast')).toBeInTheDocument()
    expect(screen.getByText('llm')).toBeInTheDocument()
  })

  it('shows free tier details when available', () => {
    render(<ApiCard api={api} />)
    expect(screen.getByText(/14,400 req\/day/)).toBeInTheDocument()
  })

  it('applies no-free class when free tier is unavailable', () => {
    const noFreeApi = { ...api, freeTier: { available: false, details: 'No free tier' } }
    const { container } = render(<ApiCard api={noFreeApi} />)
    expect(container.querySelector('.card-free')).toHaveClass('no-free')
  })

  it('renders category label', () => {
    render(<ApiCard api={api} />)
    expect(screen.getByText('inference')).toBeInTheDocument()
  })
})
