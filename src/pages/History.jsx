import { useMemo } from 'react';
import { last7Days, formatDate } from '../utils/date';

function sumMacros(meals) {
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0),
      carbs: acc.carbs + (m.carbs || 0),
      fat: acc.fat + (m.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function avg(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
}

export default function History({ meals, goals }) {
  const days = last7Days();

  const dailySummaries = useMemo(() =>
    days.map((d) => {
      const dayMeals = meals.filter((m) => m.date === d);
      return { date: d, meals: dayMeals, ...sumMacros(dayMeals) };
    }),
    [meals]
  );

  const averages = useMemo(() => ({
    calories: avg(dailySummaries.map((d) => d.calories)),
    protein: avg(dailySummaries.map((d) => d.protein)),
    carbs: avg(dailySummaries.map((d) => d.carbs)),
    fat: avg(dailySummaries.map((d) => d.fat)),
  }), [dailySummaries]);

  function barWidth(value, goal) {
    return Math.min((value / (goal || 1)) * 100, 100) + '%';
  }

  return (
    <div className="page">
      <div className="card">
        <h2 className="section-title">7-Day Averages</h2>
        <div className="avg-grid">
          {[
            { label: 'Calories', key: 'calories', goal: goals.calories, color: '#f59e0b', unit: 'kcal' },
            { label: 'Protein', key: 'protein', goal: goals.protein, color: '#3b82f6', unit: 'g' },
            { label: 'Carbs', key: 'carbs', goal: goals.carbs, color: '#8b5cf6', unit: 'g' },
            { label: 'Fat', key: 'fat', goal: goals.fat, color: '#10b981', unit: 'g' },
          ].map(({ label, key, goal, color, unit }) => (
            <div key={key} className="avg-item">
              <div className="avg-label-row">
                <span>{label}</span>
                <span style={{ color }}>{averages[key]}{unit} / {goal}{unit}</span>
              </div>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: barWidth(averages[key], goal), background: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {[...dailySummaries].reverse().map((day) => (
        <div key={day.date} className="card history-day">
          <div className="history-day-header">
            <span className="history-date">{formatDate(day.date)}</span>
            <span className="history-kcal">{Math.round(day.calories)} kcal</span>
          </div>
          {day.meals.length === 0 ? (
            <p className="hint">No meals logged</p>
          ) : (
            <>
              <div className="history-macros">
                <span>Protein {Math.round(day.protein)}g</span>
                <span>Carbs {Math.round(day.carbs)}g</span>
                <span>Fat {Math.round(day.fat)}g</span>
              </div>
              <ul className="history-meals">
                {day.meals.map((m) => (
                  <li key={m.id}>{m.type}: {m.description}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
