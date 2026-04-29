const BASE = '/api';

export async function loadMeals() {
  const res = await fetch(`${BASE}/meals`);
  return res.json();
}

export async function addMealToDb(meal) {
  const res = await fetch(`${BASE}/meals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meal),
  });
  return res.json();
}

export async function deleteMealFromDb(id) {
  await fetch(`${BASE}/meals/${id}`, { method: 'DELETE' });
}

export async function loadSettings() {
  const res = await fetch(`${BASE}/settings`);
  return res.json();
}

export async function saveSettings(settings) {
  await fetch(`${BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
}
