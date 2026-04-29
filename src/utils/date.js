export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function dateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function last7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  }).reverse();
}

export function formatDate(key) {
  const [y, m, d] = key.split('-');
  return new Date(+y, +m - 1, +d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}
