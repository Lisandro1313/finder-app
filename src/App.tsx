import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import SwipeScreen from './screens/SwipeScreen';
import MatchesScreen from './screens/MatchesScreen';
import ChatScreen from './screens/ChatScreen';
import CercanosScreen from './screens/CercanosScreen';
import PerfilScreen from './screens/PerfilScreen';
import './App.css';

function NavBar() {
  const { matches } = useApp();
  const totalNuevos = matches.reduce((s, m) => s + m.nuevos, 0);
  const location = useLocation();

  if (location.pathname.startsWith('/chat/')) return null;

  return (
    <nav className="navbar">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">🔥</span>
        <span className="nav-label">Descubrir</span>
      </NavLink>
      <NavLink to="/cercanos" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">📍</span>
        <span className="nav-label">Cercanos</span>
      </NavLink>
      <NavLink to="/matches" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon nav-icon-badge">
          💬
          {totalNuevos > 0 && <span className="badge">{totalNuevos}</span>}
        </span>
        <span className="nav-label">Matches</span>
      </NavLink>
      <NavLink to="/perfil" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">👤</span>
        <span className="nav-label">Perfil</span>
      </NavLink>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="app-shell">
      <div className="content-area">
        <Routes>
          <Route path="/" element={<SwipeScreen />} />
          <Route path="/cercanos" element={<CercanosScreen />} />
          <Route path="/matches" element={<MatchesScreen />} />
          <Route path="/chat/:id" element={<ChatScreen />} />
          <Route path="/perfil" element={<PerfilScreen />} />
        </Routes>
      </div>
      <NavBar />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
