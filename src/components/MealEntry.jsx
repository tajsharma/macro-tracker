import { useState } from 'react';
import { parseMealText } from '../services/ai';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function MealEntry({ settings, onAdd }) {
  const [text, setText] = useState('');
  const [mealType, setMealType] = useState('Lunch');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const canSubmit = settings.provider === 'gemini'
    ? !!settings.geminiKey
    : !!settings.anthropicProxyUrl;

  async function handleParse() {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setPreview(null);
    try {
      const result = await parseMealText(text, settings);
      setPreview(result);
    } catch (e) {
      setError(e.message || 'Failed to parse. Check your API key in Settings.');
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    if (!preview) return;
    onAdd({ type: mealType, description: text, ...preview.totals, items: preview.items });
    setText('');
    setPreview(null);
  }

  return (
    <div className="card">
      <h2 className="section-title">Log a Meal</h2>
      <div className="meal-type-row">
        {MEAL_TYPES.map((t) => (
          <button
            key={t}
            className={`pill ${mealType === t ? 'pill-active' : ''}`}
            onClick={() => setMealType(t)}
          >{t}</button>
        ))}
      </div>
      <div className="input-row">
        <textarea
          className="meal-input"
          placeholder='e.g. "3 eggs and 2 sourdough slices with a pinch of butter"'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleParse(); } }}
          rows={2}
        />
        <button
          className="btn-primary"
          onClick={handleParse}
          disabled={loading || !text.trim() || !canSubmit}
        >
          {loading ? '...' : 'Parse'}
        </button>
      </div>
      {!canSubmit && (
        <p className="hint">Add your API key in Settings to enable AI parsing.</p>
      )}
      {error && <p className="error">{error}</p>}
      {preview && (
        <div className="preview">
          <div className="preview-macros">
            <span>{preview.totals.calories} kcal</span>
            <span>{preview.totals.protein}g protein</span>
            <span>{preview.totals.carbs}g carbs</span>
            <span>{preview.totals.fat}g fat</span>
          </div>
          <ul className="preview-items">
            {preview.items.map((item, i) => (
              <li key={i}>{item.amount} {item.name} — {item.calories} kcal</li>
            ))}
          </ul>
          <button className="btn-add" onClick={handleAdd}>Add to Log</button>
        </div>
      )}
    </div>
  );
}
