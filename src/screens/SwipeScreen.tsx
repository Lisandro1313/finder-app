import React, { useState, useRef } from 'react';
import { PERFILES } from '../data/perfiles';
import type { Perfil } from '../data/perfiles';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const UMBRAL_SWIPE = 80; // px mínimos para activar swipe

export default function SwipeScreen() {
  const { addMatch, matches } = useApp();
  const navigate = useNavigate();
  const [cola, setCola] = useState<Perfil[]>([...PERFILES]);
  const [fotoIdx, setFotoIdx] = useState(0);
  const [anim, setAnim] = useState<'like' | 'nope' | null>(null);
  const [matchPopup, setMatchPopup] = useState<Perfil | null>(null);
  const [agotado, setAgotado] = useState(false);

  // Drag state
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });
  const startRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const perfil = cola[0];

  const swipe = (direccion: 'like' | 'nope') => {
    if (!perfil || anim) return;
    setDrag({ x: 0, y: 0, dragging: false });
    setAnim(direccion);
    setTimeout(() => {
      if (direccion === 'like') {
        const esMatch = Math.random() > 0.35;
        if (esMatch) {
          addMatch(perfil);
          setMatchPopup(perfil);
        }
      }
      setCola(prev => {
        const next = prev.slice(1);
        if (next.length === 0) setAgotado(true);
        return next;
      });
      setFotoIdx(0);
      setAnim(null);
    }, 380);
  };

  // Pointer events para swipe táctil
  const onPointerDown = (e: React.PointerEvent) => {
    if (anim) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, dragging: true });
    cardRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.dragging) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    setDrag(d => ({ ...d, x: dx, y: dy }));
  };

  const onPointerUp = () => {
    if (!drag.dragging) return;
    setDrag(d => ({ ...d, dragging: false }));
    if (drag.x > UMBRAL_SWIPE) swipe('like');
    else if (drag.x < -UMBRAL_SWIPE) swipe('nope');
    else setDrag({ x: 0, y: 0, dragging: false });
  };

  const resetear = () => {
    setCola([...PERFILES].sort(() => Math.random() - 0.5));
    setAgotado(false);
    setFotoIdx(0);
  };

  // Calcular rotación y opacidad de etiquetas basado en drag
  const dragRot = drag.x / 15;
  const likeOpacity = Math.min(1, Math.max(0, drag.x / UMBRAL_SWIPE));
  const nopeOpacity = Math.min(1, Math.max(0, -drag.x / UMBRAL_SWIPE));

  const cardTransform = anim === 'like'
    ? 'translateX(150%) rotate(25deg)'
    : anim === 'nope'
    ? 'translateX(-150%) rotate(-25deg)'
    : drag.dragging || drag.x !== 0
    ? `translate(${drag.x}px, ${drag.y * 0.3}px) rotate(${dragRot}deg)`
    : 'none';

  const cardTransition = (anim || (!drag.dragging && drag.x === 0))
    ? 'transform 0.35s ease'
    : 'none';

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

  const totalNuevos = matches.reduce((s, m) => s + m.nuevos, 0);

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <span style={styles.topTitle}>Finder</span>
        {totalNuevos > 0 && (
          <button style={styles.matchesBtn} onClick={() => navigate('/matches')}>
            💬 <span style={styles.matchesBadge}>{totalNuevos}</span>
          </button>
        )}
        <span style={styles.filtros}>🎛</span>
      </div>

      <div style={styles.stack}>
        {/* Tarjeta de fondo */}
        {cola[1] && (
          <div style={styles.cardBack}>
            <img src={cola[1].fotos[0]} alt="" style={styles.foto} />
          </div>
        )}

        {/* Tarjeta principal con drag */}
        <div
          ref={cardRef}
          style={{ ...styles.card, transform: cardTransform, transition: cardTransition }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <img
            src={perfil.fotos[fotoIdx]}
            alt={perfil.nombre}
            style={styles.foto}
            onClick={() => !drag.x && setFotoIdx(i => (i + 1) % perfil.fotos.length)}
            draggable={false}
          />

          {/* Indicadores de fotos */}
          {perfil.fotos.length > 1 && (
            <div style={styles.fotoDots}>
              {perfil.fotos.map((_, i) => (
                <div key={i} style={{ ...styles.dot, opacity: i === fotoIdx ? 1 : 0.35 }} />
              ))}
            </div>
          )}

          {/* LIKE / NOPE overlay */}
          <div style={{ ...styles.tagLike, opacity: anim === 'like' ? 1 : likeOpacity }}>
            LIKE 💚
          </div>
          <div style={{ ...styles.tagNope, opacity: anim === 'nope' ? 1 : nopeOpacity }}>
            NOPE ✗
          </div>

          {/* Fondo degradado hover */}
          <div style={{
            ...styles.likeOverlay,
            opacity: likeOpacity * 0.15,
          }} />
          <div style={{
            ...styles.nopeOverlay,
            opacity: nopeOpacity * 0.15,
          }} />

          <div style={styles.info}>
            <div style={styles.infoTop}>
              <span style={styles.nombreEdad}>
                {perfil.nombre}, {perfil.edad}
                {perfil.verificado && <span style={styles.verificado}> ✓</span>}
              </span>
              {perfil.online && <span style={styles.onlineDot} />}
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

      <div style={styles.botones}>
        <button
          style={{ ...styles.btnNope, transform: nopeOpacity > 0.5 ? 'scale(1.15)' : 'scale(1)' }}
          onClick={() => swipe('nope')}
        >✗</button>
        <button style={styles.btnStar}>⭐</button>
        <button
          style={{ ...styles.btnLike, transform: likeOpacity > 0.5 ? 'scale(1.15)' : 'scale(1)' }}
          onClick={() => swipe('like')}
        >♥</button>
      </div>

      {/* Popup de Match */}
      {matchPopup && (
        <div style={styles.matchOverlay} onClick={() => setMatchPopup(null)}>
          <div style={styles.matchCard} onClick={e => e.stopPropagation()}>
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
            <button style={styles.btnChat} onClick={() => {
              setMatchPopup(null);
              navigate(`/chat/${matchPopup.id}`);
            }}>
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
  matchesBtn: { background: 'none', border: '1px solid #FF4F6A', borderRadius: 20, padding: '4px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 },
  matchesBadge: { backgroundColor: '#FF4F6A', color: '#fff', borderRadius: 10, padding: '0 6px', fontSize: 11, fontWeight: 800 },
  filtros: { color: '#888', fontSize: 20, cursor: 'pointer' },
  stack: { flex: 1, position: 'relative', margin: '0 16px', minHeight: 0 },
  card: { position: 'absolute', inset: 0, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', backgroundColor: '#1a1a1a', userSelect: 'none', touchAction: 'none' },
  cardBack: { position: 'absolute', inset: '8px 12px 0', borderRadius: 20, overflow: 'hidden', opacity: 0.55, transform: 'scale(0.95)', transformOrigin: 'bottom', pointerEvents: 'none' },
  foto: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' },
  fotoDots: { position: 'absolute', top: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 4, pointerEvents: 'none' },
  dot: { width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fff' },
  tagLike: { position: 'absolute', top: 44, right: 20, padding: '6px 18px', borderRadius: 8, fontSize: 22, fontWeight: 900, border: '3px solid #4CAF50', color: '#4CAF50', transform: 'rotate(-15deg)', pointerEvents: 'none', transition: 'opacity 0.1s' },
  tagNope: { position: 'absolute', top: 44, left: 20, padding: '6px 18px', borderRadius: 8, fontSize: 22, fontWeight: 900, border: '3px solid #F44336', color: '#F44336', transform: 'rotate(15deg)', pointerEvents: 'none', transition: 'opacity 0.1s' },
  likeOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, #4CAF50)', pointerEvents: 'none' },
  nopeOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to left, transparent, #F44336)', pointerEvents: 'none' },
  info: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.92) 40%)', padding: '40px 16px 16px', pointerEvents: 'none' },
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
  botones: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, padding: '14px 20px', flexShrink: 0 },
  btnNope: { width: 62, height: 62, borderRadius: '50%', border: '2px solid #F44336', backgroundColor: 'transparent', color: '#F44336', fontSize: 26, cursor: 'pointer', transition: 'transform 0.15s' },
  btnStar: { width: 50, height: 50, borderRadius: '50%', border: '2px solid #FFD700', backgroundColor: 'transparent', color: '#FFD700', fontSize: 20, cursor: 'pointer' },
  btnLike: { width: 62, height: 62, borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', color: '#fff', fontSize: 26, cursor: 'pointer', transition: 'transform 0.15s' },
  agotado: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#0d0d0d' },
  btnReload: { background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', border: 'none', color: '#fff', padding: '14px 32px', borderRadius: 30, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  matchOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  matchCard: { backgroundColor: '#1a1a1a', borderRadius: 24, padding: '32px 28px', textAlign: 'center', maxWidth: 320, width: '90%' },
  matchFotos: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 },
  matchFoto: { width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #FF4F6A' },
  btnChat: { display: 'block', width: '100%', background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', border: 'none', color: '#fff', padding: '14px', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 10 },
  btnSeguir: { display: 'block', width: '100%', backgroundColor: 'transparent', border: '1px solid #333', color: '#aaa', padding: '12px', borderRadius: 14, fontSize: 14, cursor: 'pointer' },
};
