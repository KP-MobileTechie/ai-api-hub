import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '../SearchBar'

describe('SearchBar', () => {
  it('renders the search input', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('calls onChange when user types', () => {
    const onChange = jest.fn()
    render(<SearchBar value="" onChange={onChange} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'groq' } })
    expect(onChange).toHaveBeenCalledWith('groq')
  })

  it('shows clear button when value is non-empty', () => {
    render(<SearchBar value="groq" onChange={() => {}} />)
    expect(screen.getByText('clear')).toBeInTheDocument()
  })

  it('hides clear button when value is empty', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.queryByText('clear')).not.toBeInTheDocument()
  })

  it('calls onChange with empty string when clear is clicked', () => {
    const onChange = jest.fn()
    render(<SearchBar value="groq" onChange={onChange} />)
    fireEvent.click(screen.getByText('clear'))
    expect(onChange).toHaveBeenCalledWith('')
  })
})
