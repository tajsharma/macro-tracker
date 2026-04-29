const MODES = ['cut', 'maintain', 'bulk'];

const MODE_PRESETS = {
  cut:      { calories: 1700, protein: 160, carbs: 160, fat: 55 },
  maintain: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
  bulk:     { calories: 2500, protein: 180, carbs: 280, fat: 80 },
};

const GOAL_SLIDERS = [
  { key: 'calories', label: 'Calories', min: 1000, max: 4000, step: 50, unit: 'kcal', color: '#f59e0b' },
  { key: 'protein',  label: 'Protein',  min: 40,   max: 300,  step: 5,  unit: 'g',    color: '#3b82f6' },
  { key: 'carbs',    label: 'Carbs',    min: 50,   max: 500,  step: 5,  unit: 'g',    color: '#8b5cf6' },
  { key: 'fat',      label: 'Fat',      min: 20,   max: 200,  step: 5,  unit: 'g',    color: '#10b981' },
];

export default function Settings({ settings, updateSettings }) {
  function handleMode(mode) {
    updateSettings({ mode, goals: { ...settings.goals, ...MODE_PRESETS[mode] } });
  }

  function handleGoal(key, value) {
    updateSettings({ goals: { ...settings.goals, [key]: Number(value) } });
  }

  return (
    <div className="page">
      <div className="card">
        <h2 className="section-title">AI Provider</h2>
        <div className="toggle-row">
          {['gemini', 'anthropic'].map((p) => (
            <button
              key={p}
              className={`pill ${settings.provider === p ? 'pill-active' : ''}`}
              onClick={() => updateSettings({ provider: p })}
            >
              {p === 'gemini' ? 'Gemini (free)' : 'Anthropic (proxy)'}
            </button>
          ))}
        </div>

        {settings.provider === 'gemini' && (
          <div className="field">
            <label className="field-label">Gemini API Key</label>
            <input
              className="field-input"
              type="password"
              placeholder="AIza..."
              value={settings.geminiKey}
              onChange={(e) => updateSettings({ geminiKey: e.target.value })}
            />
            <p className="hint">Get a free key at aistudio.google.com</p>
          </div>
        )}

        {settings.provider === 'anthropic' && (
          <div className="field">
            <label className="field-label">Proxy Server URL</label>
            <input
              className="field-input"
              type="url"
              placeholder="http://localhost:3001"
              value={settings.anthropicProxyUrl}
              onChange={(e) => updateSettings({ anthropicProxyUrl: e.target.value })}
            />
            <p className="hint">Your local proxy that forwards requests to the Anthropic API.</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="section-title">Goal Mode</h2>
        <div className="toggle-row">
          {MODES.map((m) => (
            <button
              key={m}
              className={`pill ${settings.mode === m ? 'pill-active' : ''}`}
              onClick={() => handleMode(m)}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <p className="hint">Selecting a mode applies preset targets. You can fine-tune below.</p>
      </div>

      <div className="card">
        <h2 className="section-title">Daily Targets</h2>
        {GOAL_SLIDERS.map(({ key, label, min, max, step, unit, color }) => (
          <div key={key} className="slider-field">
            <div className="slider-label-row">
              <span>{label}</span>
              <span style={{ color }}>{settings.goals[key]} {unit}</span>
            </div>
            <input
              type="range"
              min={min} max={max} step={step}
              value={settings.goals[key]}
              onChange={(e) => handleGoal(key, e.target.value)}
              style={{ '--thumb-color': color }}
              className="slider"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
