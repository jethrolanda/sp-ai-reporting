import { Card } from 'react-bootstrap'
 
export default function ResultDisplay({ result }) {
  // Format the content with better line breaks and spacing
  const formattedContent = result.content.split('\n').map((line, idx) => (
    <div key={idx} style={{ marginBottom: line.trim() === '' ? '12px' : '0' }}>
      {line}
    </div>
  ))

  return (
    <Card className="border-0" style={{ background: '#1e293b', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
      <Card.Body className="p-5">
        <div className="d-flex align-items-center gap-2 mb-4 pb-3" style={{ borderBottom: '2px solid #334155' }}>
          <span style={{ fontSize: '24px' }}>⚡</span>
          <h4 className="m-0 fw-bold" style={{ color: '#06b6d4' }}>
            {result.title}
          </h4>
        </div>
        <div 
          style={{ 
            color: '#e2e8f0',
            fontSize: '15px',
            lineHeight: '1.7',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            fontFamily: '"Geist", sans-serif',
          }}
        >
          {formattedContent}
        </div>
      </Card.Body>
    </Card>
  )
}
