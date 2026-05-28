export type Category =
  | 'inference'
  | 'embeddings'
  | 'image-gen'
  | 'speech'
  | 'code'
  | 'multimodal'
  | 'vision'

export type FilterType = 'all' | 'free' | 'live' | Category

export interface FreeTier {
  available: boolean
  details: string
}

export interface ApiStatus {
  alive: boolean
  lastChecked: string
  latencyMs: number | null
}

export interface Snippets {
  python: string
  javascript: string
  curl: string
}

export interface ApiEntry {
  id: string
  name: string
  description: string
  url: string
  docsUrl: string
  category: Category
  models: string[]
  freeTier: FreeTier
  auth: string
  status: ApiStatus
  tags: string[]
  snippets: Snippets
}

export interface HistoryEntry {
  date: string
  alive: boolean
  latencyMs: number | null
}

export type History = Record<string, HistoryEntry[]>
