import { render, screen, fireEvent } from '@testing-library/react'
import { ComparisonTray } from '@/components/ComparisonTray'
import type { ApiEntry } from '@/types/api'

const apiA = { id: 'a', name: 'Alpha' } as unknown as ApiEntry
const apiB = { id: 'b', name: 'Beta' } as unknown as ApiEntry

it('renders selected items and fires compare', () => {
  const onCompare = jest.fn()
  render(<ComparisonTray selected={[apiA, apiB]} onRemove={() => {}} onClear={() => {}} onCompare={onCompare} />)
  expect(screen.getByText('Alpha')).toBeInTheDocument()
  expect(screen.getByText('Beta')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /compare/i }))
  expect(onCompare).toHaveBeenCalled()
})

it('renders nothing when empty', () => {
  const { container } = render(<ComparisonTray selected={[]} onRemove={() => {}} onClear={() => {}} onCompare={() => {}} />)
  expect(container).toBeEmptyDOMElement()
})

it('disables compare until at least two are selected', () => {
  render(<ComparisonTray selected={[apiA]} onRemove={() => {}} onClear={() => {}} onCompare={() => {}} />)
  expect(screen.getByRole('button', { name: /compare/i })).toBeDisabled()
})

it('fires onRemove for a selected item', () => {
  const onRemove = jest.fn()
  render(<ComparisonTray selected={[apiA, apiB]} onRemove={onRemove} onClear={() => {}} onCompare={() => {}} />)
  fireEvent.click(screen.getByRole('button', { name: /remove alpha/i }))
  expect(onRemove).toHaveBeenCalledWith('a')
})

it('fires onClear', () => {
  const onClear = jest.fn()
  render(<ComparisonTray selected={[apiA, apiB]} onRemove={() => {}} onClear={onClear} onCompare={() => {}} />)
  fireEvent.click(screen.getByRole('button', { name: /clear/i }))
  expect(onClear).toHaveBeenCalled()
})
