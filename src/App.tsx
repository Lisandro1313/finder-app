import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import SwipeScreen from './screens/SwipeScreen';
import MatchesScreen from './screens/MatchesScreen';
import ChatScreen from './screens/ChatScreen';
import CercanosScreen from './screens/CercanosScreen';
import PerfilScreen from './screens/PerfilScreen';
import PremiumScreen from './screens/PremiumScreen';
import './App.css';

// ── Toast global ──────────────────────────────────────────────────────────────

function ToastContainer() {
  const { toasts, removeToast } = useApp();
  if (toasts.length === 0) return null;

  return (
    <div style={toastStyles.container}>
      {toasts.map(t => (
        <div
          key={t.id}
          style={{ ...toastStyles.toast, ...getToastColor(t.tipo) }}
          onClick={() => removeToast(t.id)}
        >
          {t.foto && <img src={t.foto} alt="" style={toastStyles.foto} />}
          <span style={toastStyles.texto}>{t.texto}</span>
          <button style={toastStyles.close} onClick={() => removeToast(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}

function getToastColor(tipo: string): React.CSSProperties {
  if (tipo === 'match') return { background: 'linear-gradient(135deg, rgba(255,79,106,0.95), rgba(255,140,66,0.95))' };
  if (tipo === 'boost') return { background: 'linear-gradient(135deg, rgba(255,79,106,0.9), rgba(255,79,106,0.7))' };
  if (tipo === 'mensaje') return { backgroundColor: 'rgba(30,30,30,0.97)', border: '1px solid #333' };
  return { backgroundColor: 'rgba(20,20,20,0.97)', border: '1px solid #333' };
}

const toastStyles: Record<string, React.CSSProperties> = {
  container: { position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, width: '90%', maxWidth: 380, pointerEvents: 'none' },
  toast: { borderRadius: 16, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.5)', pointerEvents: 'all', cursor: 'pointer', animation: 'slideDown 0.3s ease' },
  foto: { width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
  texto: { flex: 1, color: '#fff', fontSize: 13, fontWeight: 600 },
  close: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14, padding: 0 },
};

// ── NavBar ────────────────────────────────────────────────────────────────────

function NavBar() {
  const { matches, premium } = useApp();
  const totalNuevos = matches.reduce((s, m) => s + m.nuevos, 0);
  const location = useLocation();

  if (location.pathname.startsWith('/chat/') || location.pathname === '/premium') return null;

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
      <NavLink to="/premium" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon" style={{ fontSize: premium !== 'free' ? 18 : 16 }}>
          {premium === 'platinum' ? '💎' : premium === 'gold' ? '⭐' : premium === 'plus' ? '⚡' : '⭐'}
        </span>
        <span className="nav-label" style={{ color: premium !== 'free' ? '#FFD700' : undefined }}>
          {premium !== 'free' ? premium.charAt(0).toUpperCase() + premium.slice(1) : 'Premium'}
        </span>
      </NavLink>
      <NavLink to="/perfil" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">👤</span>
        <span className="nav-label">Perfil</span>
      </NavLink>
    </nav>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

function AppContent() {
  return (
    <div className="app-shell">
      <ToastContainer />
      <div className="content-area">
        <Routes>
          <Route path="/" element={<SwipeScreen />} />
          <Route path="/cercanos" element={<CercanosScreen />} />
          <Route path="/matches" element={<MatchesScreen />} />
          <Route path="/chat/:id" element={<ChatScreen />} />
          <Route path="/premium" element={<PremiumScreen />} />
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
