import { useState } from 'react';
import { getCoachTip } from '../services/ai';

export default function AICoach({ settings, todayMacros, recentDays }) {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canUse = settings.provider === 'gemini'
    ? !!settings.geminiKey
    : !!settings.anthropicProxyUrl;

  async function handleGetTip() {
    setLoading(true);
    setError('');
    try {
      const result = await getCoachTip(settings, todayMacros, recentDays);
      setTip(result);
    } catch (e) {
      setError(e.message || 'Failed to get tip.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card coach-card">
      <div className="coach-header">
        <span className="coach-icon">🤖</span>
        <h2 className="section-title" style={{ margin: 0 }}>AI Coach</h2>
        <button
          className="btn-secondary"
          onClick={handleGetTip}
          disabled={loading || !canUse}
        >
          {loading ? 'Thinking…' : 'Get Tip'}
        </button>
      </div>
      {!canUse && <p className="hint">Add your API key in Settings to enable the AI coach.</p>}
      {error && <p className="error">{error}</p>}
      {tip && <p className="coach-tip">{tip}</p>}
    </div>
  );
}
