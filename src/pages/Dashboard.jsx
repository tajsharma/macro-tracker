import { useMemo } from 'react';
import DailyProgress from '../components/DailyProgress';
import MealEntry from '../components/MealEntry';
import MealList from '../components/MealList';
import AICoach from '../components/AICoach';
import { todayKey, last7Days } from '../utils/date';

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

export default function Dashboard({ meals, addMeal, deleteMeal, settings }) {
  const today = todayKey();

  const todayMeals = useMemo(
    () => meals.filter((m) => m.date === today),
    [meals, today]
  );

  const todayTotals = useMemo(() => sumMacros(todayMeals), [todayMeals]);

  const recentDays = useMemo(() => {
    return last7Days().map((d) => {
      const dayMeals = meals.filter((m) => m.date === d);
      return { date: d, ...sumMacros(dayMeals) };
    });
  }, [meals]);

  return (
    <div className="page">
      <DailyProgress totals={todayTotals} goals={settings.goals} />
      <MealEntry settings={settings} onAdd={addMeal} />
      <AICoach settings={settings} todayMacros={todayTotals} recentDays={recentDays} />
      <MealList meals={todayMeals} onDelete={deleteMeal} />
    </div>
  );
}
