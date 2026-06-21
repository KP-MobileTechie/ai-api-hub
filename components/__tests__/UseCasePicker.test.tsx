import { render, screen, fireEvent } from '@testing-library/react'
import { UseCasePicker } from '@/components/UseCasePicker'

it('calls onPick with the chosen use case', () => {
  const onPick = jest.fn()
  render(<UseCasePicker apis={[]} active={null} onPick={onPick} />)
  fireEvent.click(screen.getByRole('button', { name: /chat|inference/i }))
  expect(onPick).toHaveBeenCalled()
})

it('clears the active use case when the active button is clicked again', () => {
  const onPick = jest.fn()
  render(<UseCasePicker apis={[]} active={'inference'} onPick={onPick} />)
  fireEvent.click(screen.getByRole('button', { name: /chat|inference/i }))
  expect(onPick).toHaveBeenCalledWith(null)
})
