import React, { useState } from 'react'
import axios from 'axios'
import type { ChatMessage, ChatRequest, ChatResponse } from '../types/api'

const API_URL = import.meta.env.VITE_API_URL ?? 'https://pentastyle-ungesticular-carylon.ngrok-free.dev/chat'

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendMessage() {
    if (!input.trim() || loading) return
    setLoading(true)
    setError(null)

    const payload: ChatRequest = {
      message: input,
      history: messages.map(m => [m.user, m.bot])
    }

    try {
      const res = await axios.post<ChatResponse>(API_URL, payload)
      setMessages(prev => [...prev, { user: input, bot: res.data.response }])
      setInput('')
    } catch (e: any) {
      setError(e?.message ?? 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        width: '100%',
        margin: '24px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Chat Window */}
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: 16,
          padding: 16,
          height: 420,
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #f8faff, #fff0f7)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: '#6366f1', textAlign: 'center', marginTop: 100 }}>
            💬 Devasena’s Personal Assistant AI is here — ask me anything about her projects, skills, or achievements!
          </p>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            {/* User Message */}
            <div
              style={{
                background: 'linear-gradient(135deg, #93c5fd, #a5b4fc)',
                color: '#fff',
                borderRadius: '16px 16px 4px 16px',
                padding: '10px 14px',
                maxWidth: '75%',
                marginLeft: 'auto',
                boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
              }}
            >
              <strong>You:</strong> {m.user}
            </div>

            {/* Bot Message */}
            <div
              style={{
                background: 'linear-gradient(135deg, #fbcfe8, #c7d2fe)',
                color: '#1e293b',
                borderRadius: '16px 16px 16px 4px',
                padding: '10px 14px',
                maxWidth: '75%',
                marginTop: 8,
                boxShadow: '0 3px 6px rgba(0,0,0,0.05)',
              }}
            >
              <strong>Devasena’s AI:</strong> {m.bot}
            </div>
          </div>
        ))}

        {error && (
          <p style={{ color: '#ef4444', textAlign: 'center', marginTop: 12 }}>
            ⚠️ {error}
          </p>
        )}
      </div>

      {/* Input Area */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginTop: 8,
        }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' ? sendMessage() : null}
          placeholder='Ask me something about Devasena...'
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 12,
            border: '1px solid #d1d5db',
            outline: 'none',
            fontSize: '1rem',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: '12px 18px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #818cf8, #ec4899)',
            border: 'none',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >



          {loading ? '✨ Thinking…' : 'Send'}
        </button>
      </div>
    </div>
  )
}
<footer style={{ textAlign: 'center', marginTop: 12 }}>
  <p style={{ fontSize: '0.85rem', color: '#666' }}>
    💬 I’m Devasena’s AI-powered portfolio.
    If something feels off, <a href="mailto:vangavoludevasena@gmail.com" style={{ color: '#6a0dad' }}>let me know</a>.
  </p>
  <button
    onClick={() => window.open('https://calendly.com/devasena', '_blank')}
    style={{
      background: '#6a0dad',
      color: '#fff',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      marginTop: '6px'
    }}
  >
    📅 Meet Me
  </button>
</footer>
