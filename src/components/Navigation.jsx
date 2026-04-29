import { NavLink } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="nav">
      <div className="nav-brand">MacroTracker</div>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Today</NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>History</NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Settings</NavLink>
      </div>
    </nav>
  );
}
