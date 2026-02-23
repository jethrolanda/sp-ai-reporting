import { useState, useCallback } from 'react';

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
  'Great question! Based on the rugby data available: Rugby is a dynamic sport with rich statistics across all competitions. Connect your backend at /api/chat to get live, real-time data about specific games, player performance metrics, coaching decisions, and live scores.'
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

export function useRugbyQuery() {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');

  const submitQuery = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setLastQuery(content.trim());

    try {
      let responseText: string;
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content.trim() })
        });
        if (!response.ok) throw new Error('Backend not available');
        const data = await response.json();
        responseText = data.message || data.reply || getMockResponse(content);
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 900));
        responseText = getMockResponse(content);
      }

      setResult(responseText);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLastQuery('');
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    result,
    loading,
    error,
    lastQuery,
    submitQuery,
    reset
  };
}