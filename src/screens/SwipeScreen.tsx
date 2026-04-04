import React, { useState } from 'react';
import { PERFILES } from '../data/perfiles';
import type { Perfil } from '../data/perfiles';
import { useApp } from '../context/AppContext';

export default function SwipeScreen() {
  const { addMatch } = useApp();
  const [cola, setCola] = useState<Perfil[]>([...PERFILES]);
  const [fotoIdx, setFotoIdx] = useState(0);
  const [anim, setAnim] = useState<'like' | 'nope' | null>(null);
  const [matchPopup, setMatchPopup] = useState<Perfil | null>(null);
  const [agotado, setAgotado] = useState(false);

  const perfil = cola[0];

  const swipe = (direccion: 'like' | 'nope') => {
    if (!perfil) return;
    setAnim(direccion);
    setTimeout(() => {
      if (direccion === 'like') {
        // 50% chance de match
        const esMatch = Math.random() > 0.4;
        if (esMatch) {
          addMatch(perfil);
          setMatchPopup(perfil);
        }
      }
      setCola(prev => prev.slice(1));
      setFotoIdx(0);
      setAnim(null);
      if (cola.length <= 1) setAgotado(true);
    }, 350);
  };

  const resetear = () => {
    setCola([...PERFILES].sort(() => Math.random() - 0.5));
    setAgotado(false);
    setFotoIdx(0);
  };

  if (agotado) {
    return (
      <div style={styles.agotado}>
        <div style={{ fontSize: 60 }}>🔥</div>
        <h2 style={{ color: '#fff', margin: '12px 0 8px' }}>¡Viste todos los perfiles!</h2>
        <p style={{ color: '#aaa', marginBottom: 24 }}>Volvé más tarde o recargá</p>
        <button style={styles.btnReload} onClick={resetear}>🔄 Ver de nuevo</button>
      </div>
    );
  }

  if (!perfil) return null;

  const cardStyle: React.CSSProperties = {
    ...styles.card,
    transform: anim === 'like'
      ? 'translateX(120%) rotate(20deg)'
      : anim === 'nope'
      ? 'translateX(-120%) rotate(-20deg)'
      : 'none',
    transition: anim ? 'transform 0.35s ease' : 'none',
  };

  return (
    <div style={styles.container}>
      {/* Info de la persona */}
      <div style={styles.topBar}>
        <span style={styles.topTitle}>Finder</span>
        <span style={styles.filtros}>🎛 Filtros</span>
      </div>

      {/* Stack de tarjetas */}
      <div style={styles.stack}>
        {/* Tarjeta de fondo (preview siguiente) */}
        {cola[1] && (
          <div style={styles.cardBack}>
            <img src={cola[1].fotos[0]} alt="" style={styles.foto} />
          </div>
        )}

        {/* Tarjeta principal */}
        <div style={cardStyle}>
          {/* Foto */}
          <img
            src={perfil.fotos[fotoIdx]}
            alt={perfil.nombre}
            style={styles.foto}
            onClick={() => setFotoIdx(i => (i + 1) % perfil.fotos.length)}
          />

          {/* Indicadores de fotos */}
          {perfil.fotos.length > 1 && (
            <div style={styles.fotoDots}>
              {perfil.fotos.map((_, i) => (
                <div key={i} style={{ ...styles.dot, opacity: i === fotoIdx ? 1 : 0.4 }} />
              ))}
            </div>
          )}

          {/* Etiquetas LIKE / NOPE */}
          {anim === 'like' && (
            <div style={{ ...styles.tag, ...styles.tagLike }}>LIKE 💚</div>
          )}
          {anim === 'nope' && (
            <div style={{ ...styles.tag, ...styles.tagNope }}>NOPE ✗</div>
          )}

          {/* Info de la persona */}
          <div style={styles.info}>
            <div style={styles.infoTop}>
              <span style={styles.nombreEdad}>
                {perfil.nombre}, {perfil.edad}
                {perfil.verificado && <span style={styles.verificado}> ✓</span>}
              </span>
              {perfil.online && <span style={styles.onlineDot}></span>}
            </div>
            <div style={styles.distancia}>📍 {perfil.distancia} km · {perfil.ciudad}</div>
            <div style={styles.compatibilidad}>
              <span style={styles.compatPct}>{perfil.compatibilidad}%</span>
              <span style={{ color: '#aaa', fontSize: 12 }}> compatibilidad</span>
            </div>
            <p style={styles.bio}>{perfil.bio}</p>
            <div style={styles.intereses}>
              {perfil.intereses.map(i => (
                <span key={i} style={styles.tag2}>{i}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={styles.botones}>
        <button style={styles.btnNope} onClick={() => swipe('nope')}>✗</button>
        <button style={styles.btnStar}>⭐</button>
        <button style={styles.btnLike} onClick={() => swipe('like')}>♥</button>
      </div>

      {/* Popup de Match */}
      {matchPopup && (
        <div style={styles.matchOverlay} onClick={() => setMatchPopup(null)}>
          <div style={styles.matchCard}>
            <div style={{ fontSize: 50, marginBottom: 8 }}>🎉</div>
            <h2 style={{ color: '#FF4F6A', margin: '0 0 4px' }}>¡Es un Match!</h2>
            <p style={{ color: '#ccc', margin: '0 0 20px', fontSize: 14 }}>
              Vos y {matchPopup.nombre} se gustaron
            </p>
            <div style={styles.matchFotos}>
              <img src="https://picsum.photos/seed/miperfil/100/100" style={styles.matchFoto} alt="Yo" />
              <span style={{ color: '#FF4F6A', fontSize: 30 }}>❤</span>
              <img src={matchPopup.fotos[0]} style={styles.matchFoto} alt={matchPopup.nombre} />
            </div>
            <button style={styles.btnChat} onClick={() => setMatchPopup(null)}>
              💬 Enviar mensaje
            </button>
            <button style={styles.btnSeguir} onClick={() => setMatchPopup(null)}>
              Seguir buscando
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0d0d0d', overflow: 'hidden' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', flexShrink: 0 },
  topTitle: { fontSize: 26, fontWeight: 900, background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  filtros: { color: '#888', fontSize: 14, cursor: 'pointer' },
  stack: { flex: 1, position: 'relative', margin: '0 16px', minHeight: 0 },
  card: { position: 'absolute', inset: 0, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', cursor: 'pointer', backgroundColor: '#1a1a1a' },
  cardBack: { position: 'absolute', inset: '8px 12px 0', borderRadius: 20, overflow: 'hidden', opacity: 0.6, transform: 'scale(0.96)', transformOrigin: 'bottom' },
  foto: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  fotoDots: { position: 'absolute', top: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fff' },
  tag: { position: 'absolute', top: 40, padding: '6px 16px', borderRadius: 8, fontSize: 22, fontWeight: 900, border: '3px solid', zIndex: 10 },
  tagLike: { right: 20, color: '#4CAF50', borderColor: '#4CAF50', transform: 'rotate(-15deg)' },
  tagNope: { left: 20, color: '#F44336', borderColor: '#F44336', transform: 'rotate(15deg)' },
  info: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.92) 40%)', padding: '40px 16px 16px' },
  infoTop: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 },
  nombreEdad: { fontSize: 22, fontWeight: 800, color: '#fff' },
  verificado: { color: '#4FC3F7', fontSize: 16 },
  onlineDot: { width: 10, height: 10, borderRadius: '50%', backgroundColor: '#4CAF50', border: '2px solid #fff' },
  distancia: { color: '#ccc', fontSize: 13, marginBottom: 4 },
  compatibilidad: { marginBottom: 6 },
  compatPct: { color: '#FF4F6A', fontWeight: 800, fontSize: 14 },
  bio: { color: '#ddd', fontSize: 13, margin: '4px 0 8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  intereses: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  tag2: { backgroundColor: 'rgba(255,79,106,0.2)', color: '#FF4F6A', border: '1px solid #FF4F6A', borderRadius: 20, padding: '2px 10px', fontSize: 11 },
  botones: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, padding: '16px 20px', flexShrink: 0 },
  btnNope: { width: 60, height: 60, borderRadius: '50%', border: '2px solid #F44336', backgroundColor: 'transparent', color: '#F44336', fontSize: 26, cursor: 'pointer' },
  btnStar: { width: 50, height: 50, borderRadius: '50%', border: '2px solid #FFD700', backgroundColor: 'transparent', color: '#FFD700', fontSize: 20, cursor: 'pointer' },
  btnLike: { width: 60, height: 60, borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', color: '#fff', fontSize: 26, cursor: 'pointer' },
  agotado: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#0d0d0d' },
  btnReload: { background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', border: 'none', color: '#fff', padding: '14px 32px', borderRadius: 30, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  matchOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  matchCard: { backgroundColor: '#1a1a1a', borderRadius: 24, padding: '32px 28px', textAlign: 'center', maxWidth: 320, width: '90%' },
  matchFotos: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 },
  matchFoto: { width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #FF4F6A' },
  btnChat: { display: 'block', width: '100%', background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', border: 'none', color: '#fff', padding: '14px', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 10 },
  btnSeguir: { display: 'block', width: '100%', backgroundColor: 'transparent', border: '1px solid #333', color: '#aaa', padding: '12px', borderRadius: 14, fontSize: 14, cursor: 'pointer' },
};
