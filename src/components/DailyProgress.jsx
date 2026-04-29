import RingChart from './RingChart';

export default function DailyProgress({ totals, goals }) {
  return (
    <div className="card">
      <h2 className="section-title">Today's Progress</h2>
      <div className="rings-row">
        <RingChart label="Calories" value={totals.calories} goal={goals.calories} color="#f59e0b" unit="kcal" />
        <RingChart label="Protein" value={totals.protein} goal={goals.protein} color="#3b82f6" />
        <RingChart label="Carbs" value={totals.carbs} goal={goals.carbs} color="#8b5cf6" />
        <RingChart label="Fat" value={totals.fat} goal={goals.fat} color="#10b981" />
      </div>
    </div>
  );
}
