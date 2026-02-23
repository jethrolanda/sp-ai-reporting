import React, { useEffect, useRef } from 'react';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { useRugbyQuery } from '../hooks/useRugbyQuery';
const SUGGESTED_PROMPTS = [
'Who are the top scorers this season?',
"Summarize last weekend's matches",
'Tell me about the All Blacks squad',
'What are the upcoming fixtures?'];

export default function RugbyChat() {
  const { query, setQuery, result, loading, error, lastQuery, submitQuery } =
  useRugbyQuery();
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const hasResult = result !== null || error !== null || loading;
  useEffect(() => {
    if (hasResult) {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [result, loading]);
  const handleSubmit = () => {
    if (!query.trim() || loading) return;
    submitQuery(query);
    setQuery('');
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  const handleSuggestion = (prompt) => {
    setQuery(prompt);
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  return (
    <div className="gpt-shell">
      {/* Scrollable content */}
      <div className="gpt-body">
        <Container className="gpt-container">
          {/* Empty / welcome state */}
          {!hasResult &&
          <div className="gpt-welcome">
              <div className="gpt-welcome-icon">🏉</div>
              <h2 className="gpt-welcome-title">Rugby AI Assistant</h2>
              <p className="gpt-welcome-sub">
                Ask anything about games, players, coaches &amp; scores.
              </p>
              <div className="gpt-chips">
                {SUGGESTED_PROMPTS.map((p) =>
              <button
                key={p}
                className="gpt-chip"
                onClick={() => handleSuggestion(p)}>

                    {p}
                  </button>
              )}
              </div>
            </div>
          }

          {/* Conversation */}
          {hasResult &&
          <div className="gpt-convo">
              {/* User turn */}
              {lastQuery &&
            <div className="gpt-turn gpt-turn--user">
                  <div className="gpt-avatar gpt-avatar--user">You</div>
                  <div className="gpt-bubble gpt-bubble--user">{lastQuery}</div>
                </div>
            }

              {/* AI turn */}
              <div className="gpt-turn gpt-turn--ai">
                <div className="gpt-avatar gpt-avatar--ai">🏉</div>
                <div className="gpt-bubble gpt-bubble--ai">
                  {loading &&
                <span className="gpt-dots">
                      <span />
                      <span />
                      <span />
                    </span>
                }
                  {error && !loading &&
                <span className="gpt-error">{error}</span>
                }
                  {result && !loading &&
                <span
                  style={{
                    whiteSpace: 'pre-line'
                  }}>

                      {result}
                    </span>
                }
                </div>
              </div>
            </div>
          }

          <div ref={bottomRef} />
        </Container>
      </div>

      {/* Fixed input bar */}
      <div className="gpt-input-wrap">
        <Container className="gpt-container">
          <div className="gpt-input-box">
            <Form.Control
              as="textarea"
              ref={inputRef}
              rows={1}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                // auto-grow
                const el = e.target;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 160) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about rugby…"
              disabled={loading}
              className="gpt-textarea" />

            <button
              className={`gpt-send ${query.trim() && !loading ? 'gpt-send--active' : ''}`}
              onClick={handleSubmit}
              disabled={!query.trim() || loading}
              aria-label="Send">

              {loading ?
              <Spinner
                animation="border"
                size="sm"
                style={{
                  width: 16,
                  height: 16
                }} /> :


              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                  d="M8 1L8 15M8 1L3 6M8 1L13 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round" />

                </svg>
              }
            </button>
          </div>
          <p className="gpt-disclaimer">
            Rugby AI can make mistakes. Verify important match stats.
          </p>
        </Container>
      </div>
    </div>);

}