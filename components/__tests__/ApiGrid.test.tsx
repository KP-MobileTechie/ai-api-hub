import { render, screen, fireEvent } from '@testing-library/react'
import { ApiGrid } from '../ApiGrid'
import type { ApiEntry } from '@/types/api'

const makeApi = (id: string, name: string, free: boolean, alive: boolean): ApiEntry => ({
  id,
  name,
  description: `${name} description.`,
  url: 'https://test.com',
  docsUrl: 'https://test.com/docs',
  category: 'inference',
  models: [],
  freeTier: { available: free, details: free ? 'Free' : 'Paid' },
  auth: 'api_key',
  status: { alive, lastChecked: '', latencyMs: alive ? 100 : null },
  tags: [],
  snippets: { python: 'print(1)', javascript: 'log(1)', curl: 'curl ...' },
})

const apis = [
  makeApi('groq', 'Groq', true, true),
  makeApi('openai', 'OpenAI', false, true),
  makeApi('cohere', 'Cohere', false, false),
]

describe('ApiGrid', () => {
  it('renders all API cards initially', () => {
    render(<ApiGrid apis={apis} />)
    expect(screen.getByText('Groq')).toBeInTheDocument()
    expect(screen.getByText('OpenAI')).toBeInTheDocument()
    expect(screen.getByText('Cohere')).toBeInTheDocument()
  })

  it('filters cards when search query is typed', () => {
    render(<ApiGrid apis={apis} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'groq' } })
    expect(screen.getByText('Groq')).toBeInTheDocument()
    expect(screen.queryByText('OpenAI')).not.toBeInTheDocument()
  })

  it('shows result count', () => {
    render(<ApiGrid apis={apis} />)
    expect(screen.getByText('Showing 3 results')).toBeInTheDocument()
  })

  it('shows no-results message when nothing matches', () => {
    render(<ApiGrid apis={apis} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'zzz_no_match' } })
    expect(screen.getByText(/no apis match/i)).toBeInTheDocument()
  })
})
