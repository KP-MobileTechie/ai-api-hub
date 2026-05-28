import { render, screen, fireEvent } from '@testing-library/react'
import { CodeSnippet } from '../CodeSnippet'
import type { Snippets } from '@/types/api'

const snippets: Snippets = {
  python: 'print("hello")',
  javascript: 'console.log("hello")',
  curl: 'curl https://example.com',
}

describe('CodeSnippet', () => {
  it('shows Python code by default', () => {
    render(<CodeSnippet snippets={snippets} latencyMs={210} />)
    expect(screen.getByText('print("hello")')).toBeInTheDocument()
  })

  it('switches to JavaScript when JS tab is clicked', () => {
    render(<CodeSnippet snippets={snippets} latencyMs={210} />)
    fireEvent.click(screen.getByRole('button', { name: 'JS' }))
    expect(screen.getByText('console.log("hello")')).toBeInTheDocument()
  })

  it('switches to cURL when cURL tab is clicked', () => {
    render(<CodeSnippet snippets={snippets} latencyMs={210} />)
    fireEvent.click(screen.getByRole('button', { name: 'cURL' }))
    expect(screen.getByText('curl https://example.com')).toBeInTheDocument()
  })

  it('shows latency when provided', () => {
    render(<CodeSnippet snippets={snippets} latencyMs={210} />)
    expect(screen.getByText('210ms avg')).toBeInTheDocument()
  })

  it('shows "last seen" text when latencyMs is null', () => {
    render(<CodeSnippet snippets={snippets} latencyMs={null} />)
    expect(screen.getByText(/last seen/i)).toBeInTheDocument()
  })
})
