import { useState, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MOCK_RESPONSES: Record<string, string> = {
  score:
  'Based on recent match data: The All Blacks defeated South Africa 31–18 in a thrilling encounter last weekend. The Springboks led 18–10 at half-time before New Zealand mounted a stunning second-half comeback. Full match stats are available in the dashboard.',
  player:
  "Looking at current player stats: Richie Mo'unga leads the points tally with 187 points this season (12 tries, 43 conversions, 19 penalties). Ardie Savea has been outstanding at No. 8 with 9 tries and 92% tackle success rate across 14 appearances.",
  coach:
  "Current coaching staff update: Ian Foster continues as All Blacks head coach with a 78% win rate since taking charge. Warren Gatland has returned to Wales, implementing a high-tempo attacking system. Eddie Jones is rebuilding Australia's forward pack with a focus on set-piece dominance.",
  fixture:
  'Upcoming fixtures this month:\n• Sat 24 Feb – England vs Ireland (Twickenham, 17:45 GMT)\n• Sat 24 Feb – France vs Scotland (Stade de France, 21:00 GMT)\n• Sun 25 Feb – Wales vs Italy (Principality Stadium, 15:00 GMT)\n• Sat 2 Mar – Ireland vs France (Aviva Stadium, 17:45 GMT)',
  team: "Squad analysis: The All Blacks 23-man squad for the upcoming series features 8 uncapped players. The Lions tour selection is generating debate, with 12 Irish players currently in contention based on Six Nations form. England's squad depth at tighthead prop remains a concern heading into the autumn internationals.",
  default:
  "Great question! Based on the rugby data available, here's what I can tell you: Rugby is a dynamic sport with rich statistics across all competitions. Connect your backend at /api/chat to get live, real-time data about specific games, player performance metrics, coaching decisions, and live scores. In the meantime, I can answer general questions about rugby rules, history, and team strategies."
};

function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  if (
  lower.includes('score') ||
  lower.includes('result') ||
  lower.includes('match') ||
  lower.includes('game'))

  return MOCK_RESPONSES.score;
  if (
  lower.includes('player') ||
  lower.includes('stat') ||
  lower.includes('try') ||
  lower.includes('points'))

  return MOCK_RESPONSES.player;
  if (
  lower.includes('coach') ||
  lower.includes('manager') ||
  lower.includes('staff'))

  return MOCK_RESPONSES.coach;
  if (
  lower.includes('fixture') ||
  lower.includes('upcoming') ||
  lower.includes('schedule') ||
  lower.includes('next'))

  return MOCK_RESPONSES.fixture;
  if (
  lower.includes('team') ||
  lower.includes('squad') ||
  lower.includes('selection') ||
  lower.includes('lineup'))

  return MOCK_RESPONSES.team;
  return MOCK_RESPONSES.default;
}

export function useRugbyChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      try {
        let responseText: string;

        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: content.trim(),
              history: messages.map((m) => ({
                role: m.role,
                content: m.content
              }))
            })
          });

          if (!response.ok) throw new Error('Backend not available');
          const data = await response.json();
          responseText = data.message || data.reply || getMockResponse(content);
        } catch {
          // Backend not connected — use mock response
          await new Promise((resolve) => setTimeout(resolve, 900));
          responseText = getMockResponse(content);
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseText,
          timestamp: new Date()
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearMessages };
}