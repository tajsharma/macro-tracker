const TYPE_COLORS = {
  Breakfast: '#f59e0b',
  Lunch: '#3b82f6',
  Dinner: '#8b5cf6',
  Snack: '#10b981',
};

export default function MealList({ meals, onDelete }) {
  if (!meals.length) {
    return (
      <div className="card empty-state">
        <p>No meals logged today. Use the form above to add your first meal.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="section-title">Today's Meals</h2>
      <ul className="meal-list">
        {meals.map((meal) => (
          <li key={meal.id} className="meal-item">
            <div className="meal-header">
              <span className="meal-type-badge" style={{ color: TYPE_COLORS[meal.type] ?? '#94a3b8' }}>
                {meal.type}
              </span>
              <span className="meal-kcal">{Math.round(meal.calories)} kcal</span>
              <button className="btn-delete" onClick={() => onDelete(meal.id)} aria-label="Delete">✕</button>
            </div>
            <p className="meal-desc">{meal.description}</p>
            <div className="meal-macros">
              <span>P {Math.round(meal.protein)}g</span>
              <span>C {Math.round(meal.carbs)}g</span>
              <span>F {Math.round(meal.fat)}g</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
