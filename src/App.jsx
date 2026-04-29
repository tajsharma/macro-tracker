import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';
import { useAppState } from './hooks/useAppState';
import './App.css';

export default function App() {
  const { meals, addMeal, deleteMeal, settings, updateSettings, loading } = useAppState();

  if (loading) {
    return <div className="app loading-screen">Loading…</div>;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <main className="main">
          <Routes>
            <Route
              path="/"
              element={<Dashboard meals={meals} addMeal={addMeal} deleteMeal={deleteMeal} settings={settings} />}
            />
            <Route
              path="/history"
              element={<History meals={meals} goals={settings.goals} />}
            />
            <Route
              path="/settings"
              element={<Settings settings={settings} updateSettings={updateSettings} />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
