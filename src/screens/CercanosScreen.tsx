import React, { useState } from 'react';
import { PERFILES } from '../data/perfiles';
import { useApp } from '../context/AppContext';

export default function CercanosScreen() {
  const { addMatch } = useApp();
  const [saludado, setSaludado] = useState<Set<number>>(new Set());
  const [popup, setPopup] = useState<number | null>(null);

  const cercanos = [...PERFILES].sort((a, b) => a.distancia - b.distancia);

  const saludar = (id: number) => {
    setSaludado(prev => new Set(prev).add(id));
    const perfil = cercanos.find(p => p.id === id);
    if (perfil && Math.random() > 0.5) {
      addMatch(perfil);
      setPopup(id);
      setTimeout(() => setPopup(null), 3000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.titulo}>Cercanos</h2>
        <p style={styles.subtitulo}>Personas que están cerca tuyo ahora</p>
      </div>

      {/* Mapa simulado */}
      <div style={styles.mapaFake}>
        <div style={styles.mapaLabel}>📍 Buenos Aires, Argentina</div>
        {/* Puntos de personas en el "mapa" */}
        {cercanos.slice(0, 6).map((p, i) => {
          const angulo = (i / 6) * 2 * Math.PI;
          const radio = 60 + (p.distancia / 8) * 50;
          const x = 50 + Math.cos(angulo) * (radio / 1.5);
          const y = 50 + Math.sin(angulo) * radio * 0.4;
          return (
            <div key={p.id} style={{ ...styles.mapaPunto, left: `${x}%`, top: `${y}%` }}>
              <img src={p.fotos[0]} alt={p.nombre} style={styles.mapaFoto} />
              {p.online && <span style={styles.onlineDot} />}
            </div>
          );
        })}
        {/* Yo en el centro */}
        <div style={styles.mapaYo}>
          <div style={styles.mapaYoCircle}>YO</div>
          <div style={styles.mapaYoPulse} />
        </div>
      </div>

      {/* Lista */}
      <div style={styles.lista}>
        {cercanos.map(p => (
          <div key={p.id} style={styles.item}>
            <div style={styles.fotoWrap}>
              <img src={p.fotos[0]} alt={p.nombre} style={styles.foto} />
              {p.online && <span style={styles.onlineDotList} />}
            </div>
            <div style={styles.info}>
              <div style={styles.infoTop}>
                <span style={styles.nombre}>{p.nombre}, {p.edad}</span>
                {p.verificado && <span style={styles.verif}>✓</span>}
              </div>
              <span style={styles.dist}>📍 {p.distancia} km · Hace {p.distancia * 3} min</span>
              <div style={styles.intereses}>
                {p.intereses.slice(0, 2).map(i => (
                  <span key={i} style={styles.tag}>{i}</span>
                ))}
              </div>
            </div>
            <button
              style={{ ...styles.btnSaludar, ...(saludado.has(p.id) ? styles.btnSaludado : {}) }}
              onClick={() => !saludado.has(p.id) && saludar(p.id)}
              disabled={saludado.has(p.id)}
            >
              {saludado.has(p.id) ? '👋 Enviado' : '👋 Saludar'}
            </button>
          </div>
        ))}
      </div>

      {/* Popup de match */}
      {popup && (
        <div style={styles.toastMatch}>
          🎉 ¡Match con {cercanos.find(p => p.id === popup)?.nombre}!
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0d0d0d', overflow: 'hidden' },
  header: { padding: '16px 20px 8px', flexShrink: 0 },
  titulo: { fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 4px' },
  subtitulo: { color: '#666', fontSize: 13, margin: 0 },
  mapaFake: { height: 200, backgroundColor: '#111', margin: '0 16px 16px', borderRadius: 16, position: 'relative', overflow: 'hidden', flexShrink: 0, border: '1px solid #222' },
  mapaLabel: { position: 'absolute', top: 10, left: 12, color: '#888', fontSize: 12, zIndex: 2 },
  mapaPunto: { position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 3 },
  mapaFoto: { width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #FF4F6A' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', backgroundColor: '#4CAF50', border: '2px solid #111' },
  mapaYo: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 4 },
  mapaYoCircle: { width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12 },
  mapaYoPulse: { position: 'absolute', inset: -8, borderRadius: '50%', border: '2px solid rgba(255,79,106,0.4)', animation: 'pulse 2s infinite' },
  lista: { flex: 1, overflowY: 'auto' },
  item: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid #1a1a1a' },
  fotoWrap: { position: 'relative', flexShrink: 0 },
  foto: { width: 54, height: 54, borderRadius: '50%', objectFit: 'cover' },
  onlineDotList: { position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: '50%', backgroundColor: '#4CAF50', border: '2px solid #0d0d0d' },
  info: { flex: 1, minWidth: 0 },
  infoTop: { display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 },
  nombre: { color: '#fff', fontWeight: 700, fontSize: 14 },
  verif: { color: '#4FC3F7', fontSize: 12 },
  dist: { color: '#888', fontSize: 12, display: 'block', marginBottom: 4 },
  intereses: { display: 'flex', gap: 4 },
  tag: { backgroundColor: 'rgba(255,79,106,0.15)', color: '#FF4F6A', border: '1px solid rgba(255,79,106,0.3)', borderRadius: 20, padding: '1px 8px', fontSize: 10 },
  btnSaludar: { background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' as const },
  btnSaludado: { background: '#222', color: '#666' },
  toastMatch: { position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#FF4F6A', color: '#fff', padding: '12px 24px', borderRadius: 30, fontWeight: 700, fontSize: 15, zIndex: 100, boxShadow: '0 4px 20px rgba(255,79,106,0.5)' },
};
