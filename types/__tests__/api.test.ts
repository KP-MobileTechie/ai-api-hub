import type { ApiEntry } from '../api'

describe('ApiEntry type', () => {
  it('accepts a valid entry', () => {
    const entry: ApiEntry = {
      id: 'groq',
      name: 'Groq',
      description: 'Fast LLM inference.',
      url: 'https://console.groq.com',
      docsUrl: 'https://console.groq.com/docs',
      category: 'inference',
      models: ['llama3-8b'],
      freeTier: { available: true, details: '14,400 req/day' },
      auth: 'api_key',
      status: { alive: true, lastChecked: '2026-05-29T06:00:00Z', latencyMs: 210 },
      tags: ['llm', 'fast'],
      snippets: { python: 'print(1)', javascript: 'console.log(1)', curl: 'curl ...' },
    }
    expect(entry.id).toBe('groq')
  })
})
