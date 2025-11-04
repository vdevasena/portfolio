import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Chatbot from '../src/components/Chatbot'

vi.mock('axios', () => ({
  default: { post: vi.fn(() => Promise.resolve({ data: { response: 'Hello from test' } })) }
}))

describe('Chatbot', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders and sends a message', async () => {
    render(<Chatbot />)

    const input = screen.getByPlaceholderText('Ask about Devasena...') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'What are Devasena\'s projects?' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    await waitFor(() => screen.getByText(/Hello from test/i))
    expect(screen.getByText(/Bot:/)).toBeInTheDocument()
  })
})