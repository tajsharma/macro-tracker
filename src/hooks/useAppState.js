import { useState, useEffect, useCallback } from 'react';
import {
  loadMeals, addMealToDb, deleteMealFromDb,
  loadSettings, saveSettings,
} from '../utils/storage';
import { todayKey } from '../utils/date';

export function useAppState() {
  const [meals, setMeals] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadMeals(), loadSettings()]).then(([m, s]) => {
      setMeals(m);
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const addMeal = useCallback(async (meal) => {
    const saved = await addMealToDb({ ...meal, date: todayKey() });
    setMeals((prev) => [...prev, saved]);
  }, []);

  const deleteMeal = useCallback(async (id) => {
    await deleteMealFromDb(id);
    setMeals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const updateSettings = useCallback(async (patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  return { meals, addMeal, deleteMeal, settings, updateSettings, loading };
}
