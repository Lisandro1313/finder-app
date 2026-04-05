import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Intencion } from '../data/perfiles';
import { getIntencionLabel } from '../data/perfiles';

const PLAN_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  free: { label: 'Gratuito', color: '#666', emoji: '' },
  plus: { label: 'Finder Plus', color: '#FF8C42', emoji: '⚡' },
  gold: { label: 'Finder Gold', color: '#FFD700', emoji: '⭐' },
  platinum: { label: 'Finder Platinum', color: '#4FC3F7', emoji: '💎' },
};

export default function PerfilScreen() {
  const navigate = useNavigate();
  const { premium, boostActivo, boostRestante, activarBoost, matches, miPerfil, setMiPerfil } = useApp();

  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(miPerfil.nombre);
  const [bio, setBio] = useState(miPerfil.bio);
  const [intencion, setIntencion] = useState<Intencion>('casual');
  const [buscando, setBuscando] = useState<'mujeres' | 'hombres' | 'todos'>('mujeres');
  const [distancia, setDistancia] = useState(15);
  const [edadMin, setEdadMin] = useState(20);
  const [edadMax, setEdadMax] = useState(35);
  const [modoFuego, setModoFuego] = useState(false);

  const plan = PLAN_LABELS[premium];
  const totalMatches = matches.length;
  const boostMins = Math.floor(boostRestante / 60);
  const boostSecs = boostRestante % 60;

  const guardar = () => {
    setMiPerfil({ nombre, bio });
    setEditando(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.scroll}>

        {/* Plan badge */}
        {premium !== 'free' && (
          <div style={{ ...styles.planBanner, borderColor: plan.color, backgroundColor: `${plan.color}15` }}>
            <span style={{ fontSize: 20 }}>{plan.emoji}</span>
            <span style={{ color: plan.color, fontWeight: 700, fontSize: 14 }}>{plan.label} activo</span>
          </div>
        )}

        {/* Foto + nombre */}
        <div style={styles.fotoSection}>
          <div style={styles.fotoWrap}>
            <img src={miPerfil.foto} alt="Mi perfil" style={{ ...styles.foto, border: `3px solid ${modoFuego ? '#FF4F6A' : '#333'}`, boxShadow: modoFuego ? '0 0 20px rgba(255,79,106,0.6)' : 'none' }} />
            <button style={styles.editFotoBtn}>📷</button>
          </div>
          {editando ? (
            <input style={styles.inputNombre} value={nombre} onChange={e => setNombre(e.target.value)} />
          ) : (
            <h2 style={styles.nombre}>{miPerfil.nombre}, 28</h2>
          )}
          <div style={styles.verificadoBadge}>✓ Verificado</div>
        </div>

        {/* Modo Fuego */}
        <div style={styles.seccion}>
          <div style={styles.modoFuegoRow}>
            <div>
              <span style={styles.secTitulo}>🔥 Modo Fuego</span>
              <p style={styles.modoFuegoDesc}>Cuando está activo aparecés primero en los feeds y tu perfil brilla. ¡La gente lo nota!</p>
            </div>
            <div
              style={{ ...styles.toggle, backgroundColor: modoFuego ? '#FF4F6A' : '#333' }}
              onClick={() => setModoFuego(m => !m)}
            >
              <div style={{ ...styles.toggleKnob, transform: modoFuego ? 'translateX(22px)' : 'translateX(2px)' }} />
            </div>
          </div>
        </div>

        {/* Sobre mí + Intención */}
        <div style={styles.seccion}>
          <div style={styles.secHeader}>
            <span style={styles.secTitulo}>Sobre mí</span>
            <button style={styles.editBtn} onClick={editando ? guardar : () => setEditando(true)}>
              {editando ? '✓ Guardar' : '✏️ Editar'}
            </button>
          </div>
          {editando ? (
            <textarea style={styles.textarea} value={bio} onChange={e => setBio(e.target.value)} rows={3} />
          ) : (
            <p style={styles.bio}>{miPerfil.bio}</p>
          )}

          <div style={styles.intencionSection}>
            <span style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 8 }}>Estoy buscando:</span>
            <div style={styles.intencionGrid}>
              {(['casual', 'seria', 'amigos', 'sorprendeme'] as Intencion[]).map(op => (
                <button key={op}
                  style={{ ...styles.intencionBtn, ...(intencion === op ? styles.intencionBtnActivo : {}) }}
                  onClick={() => setIntencion(op)}
                >
                  {getIntencionLabel(op)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Boost */}
        <div style={styles.seccion}>
          <span style={styles.secTitulo}>🚀 Boost</span>
          <p style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>Aparecé primero durante 30 minutos y conseguí hasta 10x más matches</p>
          {boostActivo ? (
            <div style={styles.boostActivoBox}>
              <span style={{ fontSize: 20 }}>🚀</span>
              <div>
                <p style={{ color: '#FF4F6A', fontWeight: 700, margin: 0, fontSize: 14 }}>¡Boost activo!</p>
                <p style={{ color: '#aaa', margin: 0, fontSize: 12 }}>Termina en {boostMins}:{String(boostSecs).padStart(2, '0')}</p>
              </div>
            </div>
          ) : (
            <button style={styles.btnBoost} onClick={() => {
              if (premium === 'free') { navigate('/premium'); return; }
              activarBoost();
            }}>
              {premium === 'free' ? '🚀 Boost — Requiere Premium' : '🚀 Activar Boost (30 min)'}
            </button>
          )}
        </div>

        {/* Preferencias */}
        <div style={styles.seccion}>
          <span style={styles.secTitulo}>Preferencias</span>
          <div style={styles.prefRow}>
            <span style={styles.prefLabel}>Busco</span>
            <div style={styles.chipGroup}>
              {(['mujeres', 'hombres', 'todos'] as const).map(op => (
                <button key={op} style={{ ...styles.chip, ...(buscando === op ? styles.chipActive : {}) }} onClick={() => setBuscando(op)}>
                  {op.charAt(0).toUpperCase() + op.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={styles.prefRow}>
            <span style={styles.prefLabel}>Distancia máx: <b style={{ color: '#FF4F6A' }}>{distancia} km</b></span>
            <input type="range" min={1} max={100} value={distancia} onChange={e => setDistancia(Number(e.target.value))} style={styles.slider} />
          </div>
          <div style={styles.prefRow}>
            <span style={styles.prefLabel}>Edad: <b style={{ color: '#FF4F6A' }}>{edadMin}–{edadMax} años</b></span>
            <div style={styles.rangeRow}>
              <input type="range" min={18} max={edadMax - 1} value={edadMin} onChange={e => setEdadMin(Number(e.target.value))} style={styles.slider} />
              <input type="range" min={edadMin + 1} max={70} value={edadMax} onChange={e => setEdadMax(Number(e.target.value))} style={styles.slider} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.seccion}>
          <span style={styles.secTitulo}>Mis stats</span>
          <div style={styles.statsGrid}>
            <div style={styles.statBox}><span style={styles.statNum}>{totalMatches}</span><span style={styles.statLabel}>Matches</span></div>
            <div style={styles.statBox}><span style={styles.statNum}>312</span><span style={styles.statLabel}>Likes dados</span></div>
            <div style={styles.statBox}><span style={styles.statNum}>89</span><span style={styles.statLabel}>Te gustaron</span></div>
          </div>
        </div>

        {/* Premium CTA */}
        {premium === 'free' && (
          <div style={styles.premiumCta} onClick={() => navigate('/premium')}>
            <div>
              <p style={styles.premiumCtaTitulo}>⭐ Finder Premium</p>
              <p style={styles.premiumCtaSub}>Swipes ilimitados, Rewind, ver quién te gustó y más</p>
            </div>
            <span style={{ color: '#FFD700', fontWeight: 700 }}>Ver →</span>
          </div>
        )}

        {/* Opciones */}
        <div style={styles.seccion}>
          {[
            { icon: '🔔', label: 'Notificaciones' },
            { icon: '🔒', label: 'Privacidad' },
            { icon: '❓', label: 'Ayuda' },
          ].map(opt => (
            <div key={opt.label} style={styles.opcion}>
              <span style={styles.opcionIcon}>{opt.icon}</span>
              <span style={styles.opcionLabel}>{opt.label}</span>
              <span style={{ color: '#555' }}>›</span>
            </div>
          ))}
        </div>

        <button style={styles.btnSalir}>Cerrar sesión</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0d0d0d', overflow: 'hidden' },
  scroll: { flex: 1, overflowY: 'auto', paddingBottom: 24 },
  planBanner: { display: 'flex', alignItems: 'center', gap: 8, margin: '12px 16px 0', borderRadius: 12, padding: '10px 14px', border: '1px solid' },
  fotoSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px 14px' },
  fotoWrap: { position: 'relative', marginBottom: 12 },
  foto: { width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', transition: 'box-shadow 0.3s' },
  editFotoBtn: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: '50%', background: '#FF4F6A', border: 'none', fontSize: 14, cursor: 'pointer' },
  nombre: { color: '#fff', fontWeight: 800, fontSize: 22, margin: '0 0 6px' },
  inputNombre: { backgroundColor: '#1e1e1e', border: '1px solid #FF4F6A', borderRadius: 10, color: '#fff', padding: '8px 14px', fontSize: 18, fontWeight: 700, textAlign: 'center', outline: 'none', marginBottom: 6 },
  verificadoBadge: { backgroundColor: 'rgba(79,195,247,0.15)', color: '#4FC3F7', border: '1px solid #4FC3F7', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 },
  seccion: { backgroundColor: '#111', margin: '8px 16px', borderRadius: 16, padding: 16 },
  secHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  secTitulo: { color: '#fff', fontWeight: 700, fontSize: 15, display: 'block', marginBottom: 8 },
  editBtn: { background: 'none', border: '1px solid #FF4F6A', color: '#FF4F6A', borderRadius: 20, padding: '4px 12px', fontSize: 12, cursor: 'pointer' },
  bio: { color: '#ccc', fontSize: 14, lineHeight: 1.5, margin: '0 0 14px' },
  textarea: { width: '100%', backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: 10, color: '#fff', padding: '10px', fontSize: 14, lineHeight: 1.5, outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 14 },
  intencionSection: { marginTop: 4 },
  intencionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  intencionBtn: { padding: '10px 8px', borderRadius: 12, border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#888', fontSize: 12, cursor: 'pointer', fontWeight: 600, textAlign: 'center' },
  intencionBtnActivo: { border: '1px solid #FF4F6A', color: '#FF4F6A', backgroundColor: 'rgba(255,79,106,0.12)' },
  modoFuegoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  modoFuegoDesc: { color: '#666', fontSize: 12, margin: '4px 0 0', lineHeight: 1.4 },
  toggle: { width: 48, height: 26, borderRadius: 13, cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background-color 0.3s' },
  toggleKnob: { position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff', transition: 'transform 0.3s' },
  boostActivoBox: { display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,79,106,0.1)', border: '1px solid rgba(255,79,106,0.3)', borderRadius: 12, padding: '12px 16px' },
  btnBoost: { width: '100%', background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', border: 'none', color: '#fff', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  prefRow: { marginBottom: 16 },
  prefLabel: { color: '#aaa', fontSize: 13, display: 'block', marginBottom: 8 },
  chipGroup: { display: 'flex', gap: 8 },
  chip: { backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#888', borderRadius: 20, padding: '6px 14px', fontSize: 13, cursor: 'pointer' },
  chipActive: { backgroundColor: 'rgba(255,79,106,0.2)', border: '1px solid #FF4F6A', color: '#FF4F6A' },
  slider: { width: '100%', accentColor: '#FF4F6A' },
  rangeRow: { display: 'flex', flexDirection: 'column', gap: 8 },
  statsGrid: { display: 'flex', gap: 12 },
  statBox: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: 12, padding: '12px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 },
  statNum: { color: '#FF4F6A', fontWeight: 800, fontSize: 22 },
  statLabel: { color: '#666', fontSize: 11 },
  premiumCta: { margin: '8px 16px', background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,140,66,0.1))', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' },
  premiumCtaTitulo: { color: '#FFD700', fontWeight: 700, fontSize: 14, margin: 0 },
  premiumCtaSub: { color: '#888', fontSize: 12, margin: '3px 0 0' },
  opcion: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #1a1a1a', cursor: 'pointer' },
  opcionIcon: { fontSize: 20 },
  opcionLabel: { flex: 1, color: '#ddd', fontSize: 15 },
  btnSalir: { display: 'block', margin: '16px auto', backgroundColor: 'transparent', border: '1px solid #333', color: '#888', borderRadius: 14, padding: '12px 40px', fontSize: 14, cursor: 'pointer' },
};
