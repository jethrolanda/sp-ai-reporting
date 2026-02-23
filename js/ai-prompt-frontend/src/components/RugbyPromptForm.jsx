 
import { useState } from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap'
 

export default function RugbyPromptForm({ onSubmit, disabled } ) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim()) {
      onSubmit(prompt)
      setPrompt('')
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-0">
        <Form.Label className="mb-3 fw-bold" style={{ color: '#f1f5f9', fontSize: '16px' }}>
          Enter Your Query
        </Form.Label>
        <InputGroup className="gap-2">
          <Form.Control
            placeholder="e.g., Who won the Rugby World Cup? Top try scorers?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={disabled}
            className="py-3 px-4 border-0"
            style={{
              background: '#0f172a',
              color: '#f1f5f9',
              fontSize: '15px',
              flex: 1,
            }}
          />
          <Button
            type="submit"
            disabled={disabled || !prompt.trim()}
            className="px-5 fw-bold border-0"
            style={{
              background: disabled || !prompt.trim() ? '#475569' : '#06b6d4',
              color: '#0f172a',
              fontSize: '15px',
              cursor: disabled || !prompt.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!disabled && prompt.trim()) {
                e.currentTarget.style.background = '#22d3ee'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#06b6d4'
            }}
          >
            {disabled ? '⟳ Processing' : '🔍 Search'}
          </Button>
        </InputGroup>
      </Form.Group>
      <Form.Text className="d-block mt-3" style={{ color: '#94a3b8', fontSize: '13px' }}>
        Try asking about teams, players, statistics, rules, or past tournaments.
      </Form.Text>
    </Form>
  )
}
