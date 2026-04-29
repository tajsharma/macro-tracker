export default function RingChart({ label, value, goal, color, unit = 'g' }) {
  const pct = Math.min(value / (goal || 1), 1);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const over = value > goal;

  return (
    <div className="ring-chart">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="#2a2a3a" strokeWidth="8" />
        <circle
          cx="45" cy="45" r={r} fill="none"
          stroke={over ? '#f87171' : color}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset="0"
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        <text x="45" y="42" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">
          {Math.round(value)}
        </text>
        <text x="45" y="56" textAnchor="middle" fill="#94a3b8" fontSize="9">
          / {goal}{unit}
        </text>
      </svg>
      <p className="ring-label">{label}</p>
    </div>
  );
}
