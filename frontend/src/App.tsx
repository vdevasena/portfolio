import React from 'react'
import Chatbot from './components/Chatbot'

export default function App() {
  return (
    <div style={{ maxWidth: 860, margin: '40px auto', padding: '0 16px' }}>
      <h1 style={{ textAlign: 'center' }}>Devasena Vangavolu — Portfolio</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        Ask about projects, certifications, and experience.
      </p>
      <Chatbot />
    </div>
  )
}