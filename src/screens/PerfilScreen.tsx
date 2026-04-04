import React, { useState } from 'react';

export default function PerfilScreen() {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState('Lisandro');
  const [edad] = useState('28');
  const [bio, setBio] = useState('Buscando algo real 🔥 Me gustan los viajes, la música y el buen asado.');
  const [buscando, setBuscando] = useState<'mujeres' | 'hombres' | 'todos'>('mujeres');
  const [distancia, setDistancia] = useState(15);
  const [edadMin, setEdadMin] = useState(20);
  const [edadMax, setEdadMax] = useState(35);

  return (
    <div style={styles.container}>
      <div style={styles.scroll}>
        {/* Foto + nombre */}
        <div style={styles.fotoSection}>
          <div style={styles.fotoWrap}>
            <img
              src="https://picsum.photos/seed/miperfil/300/300"
              alt="Mi perfil"
              style={styles.foto}
            />
            <button style={styles.editFotoBtn}>📷</button>
          </div>
          {editando ? (
            <input
              style={styles.inputNombre}
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
          ) : (
            <h2 style={styles.nombre}>{nombre}, {edad}</h2>
          )}
          <div style={styles.verificadoBadge}>✓ Verificado</div>
        </div>

        {/* Bio */}
        <div style={styles.seccion}>
          <div style={styles.secHeader}>
            <span style={styles.secTitulo}>Sobre mí</span>
            <button style={styles.editBtn} onClick={() => setEditando(!editando)}>
              {editando ? '✓ Guardar' : '✏️ Editar'}
            </button>
          </div>
          {editando ? (
            <textarea
              style={styles.textarea}
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
            />
          ) : (
            <p style={styles.bio}>{bio}</p>
          )}
        </div>

        {/* Preferencias */}
        <div style={styles.seccion}>
          <span style={styles.secTitulo}>Preferencias</span>

          <div style={styles.prefRow}>
            <span style={styles.prefLabel}>Busco</span>
            <div style={styles.chipGroup}>
              {(['mujeres', 'hombres', 'todos'] as const).map(op => (
                <button
                  key={op}
                  style={{ ...styles.chip, ...(buscando === op ? styles.chipActive : {}) }}
                  onClick={() => setBuscando(op)}
                >
                  {op.charAt(0).toUpperCase() + op.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.prefRow}>
            <span style={styles.prefLabel}>Distancia máxima: <b style={{ color: '#FF4F6A' }}>{distancia} km</b></span>
            <input
              type="range" min={1} max={100} value={distancia}
              onChange={e => setDistancia(Number(e.target.value))}
              style={styles.slider}
            />
          </div>

          <div style={styles.prefRow}>
            <span style={styles.prefLabel}>Edad: <b style={{ color: '#FF4F6A' }}>{edadMin} – {edadMax} años</b></span>
            <div style={styles.rangeRow}>
              <input type="range" min={18} max={edadMax - 1} value={edadMin}
                onChange={e => setEdadMin(Number(e.target.value))} style={styles.slider} />
              <input type="range" min={edadMin + 1} max={70} value={edadMax}
                onChange={e => setEdadMax(Number(e.target.value))} style={styles.slider} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.seccion}>
          <span style={styles.secTitulo}>Mis stats</span>
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <span style={styles.statNum}>47</span>
              <span style={styles.statLabel}>Matches</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>312</span>
              <span style={styles.statLabel}>Likes dados</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>89</span>
              <span style={styles.statLabel}>Te gustaron</span>
            </div>
          </div>
        </div>

        {/* Opciones */}
        <div style={styles.seccion}>
          {[
            { icon: '🔔', label: 'Notificaciones' },
            { icon: '🔒', label: 'Privacidad' },
            { icon: '⭐', label: 'Finder Premium' },
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
  scroll: { flex: 1, overflowY: 'auto', paddingBottom: 20 },
  fotoSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px 16px' },
  fotoWrap: { position: 'relative', marginBottom: 12 },
  foto: { width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid #FF4F6A' },
  editFotoBtn: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: '50%', background: '#FF4F6A', border: 'none', fontSize: 14, cursor: 'pointer' },
  nombre: { color: '#fff', fontWeight: 800, fontSize: 22, margin: '0 0 6px' },
  inputNombre: { backgroundColor: '#1e1e1e', border: '1px solid #FF4F6A', borderRadius: 10, color: '#fff', padding: '8px 14px', fontSize: 18, fontWeight: 700, textAlign: 'center', outline: 'none', marginBottom: 6 },
  verificadoBadge: { backgroundColor: 'rgba(79,195,247,0.15)', color: '#4FC3F7', border: '1px solid #4FC3F7', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 },
  seccion: { backgroundColor: '#111', margin: '8px 16px', borderRadius: 16, padding: 16 },
  secHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  secTitulo: { color: '#fff', fontWeight: 700, fontSize: 15, display: 'block', marginBottom: 10 },
  editBtn: { background: 'none', border: '1px solid #FF4F6A', color: '#FF4F6A', borderRadius: 20, padding: '4px 12px', fontSize: 12, cursor: 'pointer' },
  bio: { color: '#ccc', fontSize: 14, lineHeight: 1.5, margin: 0 },
  textarea: { width: '100%', backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: 10, color: '#fff', padding: '10px', fontSize: 14, lineHeight: 1.5, outline: 'none', resize: 'none' as const, boxSizing: 'border-box' as const },
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
  opcion: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #1a1a1a', cursor: 'pointer' },
  opcionIcon: { fontSize: 20 },
  opcionLabel: { flex: 1, color: '#ddd', fontSize: 15 },
  btnSalir: { display: 'block', margin: '16px auto', backgroundColor: 'transparent', border: '1px solid #333', color: '#888', borderRadius: 14, padding: '12px 40px', fontSize: 14, cursor: 'pointer' },
};
