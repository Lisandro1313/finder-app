import React, { useState, useRef } from 'react';
import { PERFILES } from '../data/perfiles';
import type { Perfil } from '../data/perfiles';
import { getIntencionLabel } from '../data/perfiles';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const UMBRAL_SWIPE = 80;

// ── STORIES ───────────────────────────────────────────────────────────────────

interface Story { id: number; nombre: string; foto: string; fotoStory: string; }

const STORIES: Story[] = PERFILES.slice(0, 7).map((p, i) => ({
  id: p.id, nombre: p.nombre.split(' ')[0],
  foto: p.fotos[0],
  fotoStory: `https://picsum.photos/seed/story${i + 1}/400/700`,
}));

function StoriesBar({ onOpen }: { onOpen: (s: Story) => void }) {
  const [vistos, setVistos] = useState<Set<number>>(new Set());
  return (
    <div style={sb.bar}>
      {STORIES.map(s => {
        const visto = vistos.has(s.id);
        return (
          <div key={s.id} style={sb.item} onClick={() => { setVistos(p => new Set([...p, s.id])); onOpen(s); }}>
            <div style={{ ...sb.ring, borderColor: visto ? '#444' : '#FF4F6A' }}>
              <img src={s.foto} alt={s.nombre} style={sb.avatar} />
            </div>
            <span style={{ ...sb.nombre, color: visto ? '#555' : '#ddd' }}>{s.nombre}</span>
          </div>
        );
      })}
    </div>
  );
}

const sb: Record<string, React.CSSProperties> = {
  bar: { display: 'flex', gap: 12, overflowX: 'auto', padding: '8px 16px', scrollbarWidth: 'none', flexShrink: 0 },
  item: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', flexShrink: 0 },
  ring: { width: 58, height: 58, borderRadius: '50%', border: '2.5px solid', padding: 2 },
  avatar: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' },
  nombre: { fontSize: 10, whiteSpace: 'nowrap' },
};

// ── STORY VIEWER ──────────────────────────────────────────────────────────────

function StoryViewer({ story, onClose }: { story: Story; onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  React.useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress(p => { if (p >= 100) { onClose(); return 100; } return p + 2; });
    }, 80);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div style={sv.overlay} onClick={onClose}>
      <div style={sv.card} onClick={e => e.stopPropagation()}>
        <div style={sv.progressBar}><div style={{ ...sv.progressFill, width: `${progress}%` }} /></div>
        <div style={sv.header}>
          <img src={story.foto} style={sv.headerAvatar} alt="" />
          <span style={sv.headerNombre}>{story.nombre}</span>
          <button style={sv.closeBtn} onClick={onClose}>✕</button>
        </div>
        <img src={story.fotoStory} alt="" style={sv.foto} />
        <div style={sv.footer}>
          <div style={sv.footerInput} onClick={onClose}>Enviar mensaje a {story.nombre}... 💬</div>
        </div>
      </div>
    </div>
  );
}

const sv: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 420, height: '100%', maxHeight: 740, position: 'relative', display: 'flex', flexDirection: 'column', borderRadius: 20, overflow: 'hidden' },
  progressBar: { position: 'absolute', top: 10, left: 12, right: 12, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, zIndex: 10 },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 2, transition: 'width 0.08s linear' },
  header: { position: 'absolute', top: 22, left: 12, right: 12, display: 'flex', alignItems: 'center', gap: 8, zIndex: 10 },
  headerAvatar: { width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' },
  headerNombre: { color: '#fff', fontWeight: 700, fontSize: 15, flex: 1 },
  closeBtn: { background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', padding: 4 },
  foto: { width: '100%', height: '100%', objectFit: 'cover' },
  footer: { position: 'absolute', bottom: 16, left: 12, right: 12, zIndex: 10 },
  footerInput: { backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 24, padding: '10px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer' },
};

// ── FILTROS ───────────────────────────────────────────────────────────────────

interface Filtros { edadMin: number; edadMax: number; distanciaMax: number; genero: 'todos' | 'mujer' | 'hombre' | 'nb'; }
const FILTROS_DEFAULT: Filtros = { edadMin: 18, edadMax: 45, distanciaMax: 50, genero: 'todos' };

function FiltrosPanel({ filtros, onChange, onClose }: { filtros: Filtros; onChange: (f: Filtros) => void; onClose: () => void }) {
  const [local, setLocal] = useState(filtros);
  return (
    <div style={fp.overlay} onClick={onClose}>
      <div style={fp.panel} onClick={e => e.stopPropagation()}>
        <div style={fp.header}>
          <span style={fp.titulo}>🎛 Filtros</span>
          <button style={fp.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={fp.seccion}>
          <div style={fp.secLabel}><span>Edad</span><span style={fp.valor}>{local.edadMin} – {local.edadMax} años</span></div>
          <div style={fp.rangeRow}>
            <span style={fp.rangeNum}>18</span>
            <input type="range" min={18} max={local.edadMax - 1} value={local.edadMin} onChange={e => setLocal(l => ({ ...l, edadMin: +e.target.value }))} style={fp.slider} />
            <input type="range" min={local.edadMin + 1} max={60} value={local.edadMax} onChange={e => setLocal(l => ({ ...l, edadMax: +e.target.value }))} style={fp.slider} />
            <span style={fp.rangeNum}>60</span>
          </div>
        </div>
        <div style={fp.seccion}>
          <div style={fp.secLabel}><span>Distancia máxima</span><span style={fp.valor}>{local.distanciaMax} km</span></div>
          <input type="range" min={1} max={100} value={local.distanciaMax} onChange={e => setLocal(l => ({ ...l, distanciaMax: +e.target.value }))} style={{ ...fp.slider, width: '100%' }} />
        </div>
        <div style={fp.seccion}>
          <div style={fp.secLabel}><span>Mostrar</span></div>
          <div style={fp.generoRow}>
            {(['todos', 'mujer', 'hombre', 'nb'] as const).map(g => (
              <button key={g} style={{ ...fp.generoBtn, ...(local.genero === g ? fp.generoBtnActivo : {}) }} onClick={() => setLocal(l => ({ ...l, genero: g }))}>
                {g === 'todos' ? 'Todos' : g === 'mujer' ? 'Mujeres' : g === 'hombre' ? 'Hombres' : 'No binario'}
              </button>
            ))}
          </div>
        </div>
        <div style={fp.botonesRow}>
          <button style={fp.btnReset} onClick={() => setLocal(FILTROS_DEFAULT)}>Resetear</button>
          <button style={fp.btnAplicar} onClick={() => { onChange(local); onClose(); }}>Aplicar filtros</button>
        </div>
      </div>
    </div>
  );
}

const fp: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 150, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  panel: { backgroundColor: '#161616', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 480, padding: 24, paddingBottom: 36 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  titulo: { color: '#fff', fontSize: 18, fontWeight: 700 },
  closeBtn: { background: 'none', border: 'none', color: '#888', fontSize: 18, cursor: 'pointer' },
  seccion: { marginBottom: 24 },
  secLabel: { display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: 14, marginBottom: 10 },
  valor: { color: '#FF4F6A', fontWeight: 700 },
  rangeRow: { display: 'flex', alignItems: 'center', gap: 8 },
  rangeNum: { color: '#555', fontSize: 12, minWidth: 24, textAlign: 'center' },
  slider: { flex: 1, accentColor: '#FF4F6A', cursor: 'pointer' },
  generoRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  generoBtn: { padding: '8px 14px', borderRadius: 20, border: '1px solid #333', backgroundColor: 'transparent', color: '#888', fontSize: 13, cursor: 'pointer' },
  generoBtnActivo: { border: '1px solid #FF4F6A', color: '#FF4F6A', backgroundColor: 'rgba(255,79,106,0.1)' },
  botonesRow: { display: 'flex', gap: 10 },
  btnReset: { flex: 1, padding: '14px', borderRadius: 14, border: '1px solid #333', backgroundColor: 'transparent', color: '#aaa', fontSize: 15, cursor: 'pointer' },
  btnAplicar: { flex: 2, padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
};

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function SwipeScreen() {
  const { addMatch, matches, gastarSwipe, gastarSuperLike, guardarUltimoSwipe, rewind,
    swipesRestantes, superLikesRestantes, boostActivo, boostRestante, premium, addToast } = useApp();
  const navigate = useNavigate();

  const [filtros, setFiltros] = useState<Filtros>(FILTROS_DEFAULT);
  const [showFiltros, setShowFiltros] = useState(false);
  const [storyActiva, setStoryActiva] = useState<Story | null>(null);
  const [showSwipeLimitada, setShowSwipeLimitada] = useState(false);

  const filtrar = (f: Filtros) => PERFILES.filter(p =>
    p.edad >= f.edadMin && p.edad <= f.edadMax &&
    p.distancia <= f.distanciaMax &&
    (f.genero === 'todos' || p.genero === f.genero)
  );

  const [cola, setCola] = useState<Perfil[]>(filtrar(FILTROS_DEFAULT));
  const [fotoIdx, setFotoIdx] = useState(0);
  const [anim, setAnim] = useState<'like' | 'nope' | 'super' | null>(null);
  const [matchPopup, setMatchPopup] = useState<Perfil | null>(null);
  const [agotado, setAgotado] = useState(false);
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });
  const startRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const perfil = cola[0];

  const aplicarFiltros = (f: Filtros) => {
    setFiltros(f);
    const nueva = filtrar(f);
    setCola(nueva);
    setAgotado(nueva.length === 0);
    setFotoIdx(0);
  };

  const swipe = (dir: 'like' | 'nope' | 'super') => {
    if (!perfil || anim) return;

    if (dir === 'super') {
      if (!gastarSuperLike()) {
        addToast({ tipo: 'info', texto: '⭐ Sin Super Likes. Se recargan mañana.' }); return;
      }
    } else {
      if (!gastarSwipe()) {
        setShowSwipeLimitada(true); return;
      }
    }

    guardarUltimoSwipe(perfil, dir === 'super' ? 'like' : dir);
    setDrag({ x: 0, y: 0, dragging: false });
    setAnim(dir);

    setTimeout(() => {
      const esMatch = (dir === 'like' || dir === 'super') && Math.random() > (dir === 'super' ? 0.1 : 0.35);
      if (esMatch) {
        addMatch(perfil);
        setMatchPopup(perfil);
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

  const handleRewind = () => {
    if (premium === 'free') {
      addToast({ tipo: 'info', texto: '↩ Rewind es una función Premium. Mejorá tu plan!' }); return;
    }
    const p = rewind();
    if (p) {
      setCola(prev => [p, ...prev]);
      setAgotado(false);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (anim) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, dragging: true });
    cardRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.dragging) return;
    setDrag(d => ({ ...d, x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y }));
  };
  const onPointerUp = () => {
    if (!drag.dragging) return;
    setDrag(d => ({ ...d, dragging: false }));
    if (drag.x > UMBRAL_SWIPE) swipe('like');
    else if (drag.x < -UMBRAL_SWIPE) swipe('nope');
    else setDrag({ x: 0, y: 0, dragging: false });
  };

  const dragRot = drag.x / 15;
  const likeOpacity = Math.min(1, Math.max(0, drag.x / UMBRAL_SWIPE));
  const nopeOpacity = Math.min(1, Math.max(0, -drag.x / UMBRAL_SWIPE));
  const cardTransform = anim === 'like' || anim === 'super' ? 'translateX(150%) rotate(25deg)'
    : anim === 'nope' ? 'translateX(-150%) rotate(-25deg)'
    : drag.dragging || drag.x !== 0 ? `translate(${drag.x}px,${drag.y * 0.3}px) rotate(${dragRot}deg)` : 'none';
  const cardTransition = (anim || (!drag.dragging && drag.x === 0)) ? 'transform 0.35s ease' : 'none';

  const totalNuevos = matches.reduce((s, m) => s + m.nuevos, 0);
  const filtrosActivos = [
    filtros.edadMin !== 18 || filtros.edadMax !== 45,
    filtros.distanciaMax !== 50,
    filtros.genero !== 'todos',
  ].filter(Boolean).length;

  const boostMins = Math.floor(boostRestante / 60);
  const boostSecs = boostRestante % 60;

  return (
    <div style={s.container}>
      {/* Top bar */}
      <div style={s.topBar}>
        <div style={s.topLeft}>
          <span style={s.topTitle}>Finder</span>
          {boostActivo && (
            <span style={s.boostBadge}>
              🚀 {boostMins}:{String(boostSecs).padStart(2, '0')}
            </span>
          )}
        </div>
        <div style={s.topActions}>
          {premium === 'free' && swipesRestantes <= 15 && (
            <span style={s.swipesCounter}>{swipesRestantes} swipes</span>
          )}
          {totalNuevos > 0 && (
            <button style={s.matchesBtn} onClick={() => navigate('/matches')}>
              💬 <span style={s.matchesBadge}>{totalNuevos}</span>
            </button>
          )}
          <button style={{ ...s.filtrosBtn, borderColor: filtrosActivos > 0 ? '#FF4F6A' : '#444' }} onClick={() => setShowFiltros(true)}>
            🎛{filtrosActivos > 0 && <span style={s.filtrosBadge}>{filtrosActivos}</span>}
          </button>
        </div>
      </div>

      {/* Stories */}
      <StoriesBar onOpen={setStoryActiva} />

      {/* Swipe area */}
      {agotado ? (
        <div style={s.agotado}>
          <div style={{ fontSize: 52 }}>🔥</div>
          <h2 style={{ color: '#fff', margin: '12px 0 8px' }}>¡Viste todos los perfiles!</h2>
          <p style={{ color: '#aaa', marginBottom: 12, fontSize: 14 }}>
            {filtrosActivos > 0 ? 'Probá ampliar tus filtros' : 'Volvé más tarde o ampliá la distancia'}
          </p>
          {filtrosActivos > 0 && (
            <button style={{ ...s.btnReload, background: 'transparent', border: '1px solid #FF4F6A', color: '#FF4F6A', marginBottom: 10 }} onClick={() => setShowFiltros(true)}>
              🎛 Cambiar filtros
            </button>
          )}
          <button style={s.btnReload} onClick={() => { setCola(filtrar(filtros)); setAgotado(false); }}>🔄 Ver de nuevo</button>
        </div>
      ) : perfil ? (
        <>
          <div style={s.stack}>
            {cola[1] && (
              <div style={s.cardBack}>
                <img src={cola[1].fotos[0]} alt="" style={s.foto} />
              </div>
            )}
            <div ref={cardRef}
              style={{ ...s.card, transform: cardTransform, transition: cardTransition, boxShadow: boostActivo ? '0 0 30px rgba(255,79,106,0.8), 0 8px 32px rgba(0,0,0,0.6)' : '0 8px 32px rgba(0,0,0,0.6)' }}
              onPointerDown={onPointerDown} onPointerMove={onPointerMove}
              onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
            >
              <img src={perfil.fotos[fotoIdx]} alt={perfil.nombre} style={s.foto}
                onClick={() => !drag.x && setFotoIdx(i => (i + 1) % perfil.fotos.length)}
                draggable={false} />

              {perfil.fotos.length > 1 && (
                <div style={s.fotoDots}>
                  {perfil.fotos.map((_, i) => <div key={i} style={{ ...s.dot, opacity: i === fotoIdx ? 1 : 0.35 }} />)}
                </div>
              )}

              <div style={{ ...s.tagLike, opacity: anim === 'like' || anim === 'super' ? 1 : likeOpacity }}>
                {anim === 'super' ? '⭐ SUPER' : 'LIKE 💚'}
              </div>
              <div style={{ ...s.tagNope, opacity: anim === 'nope' ? 1 : nopeOpacity }}>NOPE ✗</div>
              <div style={{ ...s.likeOverlay, opacity: likeOpacity * 0.15 }} />
              <div style={{ ...s.nopeOverlay, opacity: nopeOpacity * 0.15 }} />

              {/* Intención badge */}
              <div style={s.intencionBadge}>
                {getIntencionLabel(perfil.intencion)}
              </div>

              <div style={s.info}>
                <div style={s.infoTop}>
                  <span style={s.nombreEdad}>{perfil.nombre}, {perfil.edad}
                    {perfil.verificado && <span style={s.verificado}> ✓</span>}
                  </span>
                  {perfil.online && <span style={s.onlineDot} />}
                </div>
                <div style={s.distancia}>📍 {perfil.distancia} km · {perfil.ciudad}, {perfil.pais}</div>
                <p style={s.bio}>{perfil.bio}</p>
                <div style={s.intereses}>
                  {perfil.intereses.map(i => <span key={i} style={s.tag2}>{i}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div style={s.botones}>
            <button style={s.btnRewind} onClick={handleRewind} title="Deshacer">↩</button>
            <button style={{ ...s.btnNope, transform: nopeOpacity > 0.5 ? 'scale(1.15)' : 'scale(1)' }} onClick={() => swipe('nope')}>✗</button>
            <button style={{ ...s.btnStar, opacity: superLikesRestantes > 0 ? 1 : 0.4 }} onClick={() => swipe('super')} title={`${superLikesRestantes} super likes`}>⭐</button>
            <button style={{ ...s.btnLike, transform: likeOpacity > 0.5 ? 'scale(1.15)' : 'scale(1)' }} onClick={() => swipe('like')}>♥</button>
            <button style={s.btnBoost} onClick={() => navigate('/perfil')} title="Boost">🚀</button>
          </div>
        </>
      ) : null}

      {/* Match popup */}
      {matchPopup && (
        <div style={s.matchOverlay} onClick={() => setMatchPopup(null)}>
          <div style={s.matchCard} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 50, marginBottom: 8 }}>🎉</div>
            <h2 style={{ color: '#FF4F6A', margin: '0 0 4px' }}>¡Es un Match!</h2>
            <p style={{ color: '#ccc', margin: '0 0 6px', fontSize: 14 }}>Vos y {matchPopup.nombre} se gustaron</p>
            <p style={{ color: '#888', fontSize: 12, margin: '0 0 20px' }}>⏱ Tenés 24h para decir hola</p>
            <div style={s.matchFotos}>
              <img src="https://picsum.photos/seed/miperfil/100/100" style={s.matchFoto} alt="Yo" />
              <span style={{ color: '#FF4F6A', fontSize: 30 }}>❤</span>
              <img src={matchPopup.fotos[0]} style={s.matchFoto} alt={matchPopup.nombre} />
            </div>
            <button style={s.btnChat} onClick={() => { setMatchPopup(null); navigate(`/chat/${matchPopup.id}`); }}>
              💬 Enviar mensaje
            </button>
            <button style={s.btnSeguir} onClick={() => setMatchPopup(null)}>Seguir buscando</button>
          </div>
        </div>
      )}

      {/* Swipe limit modal */}
      {showSwipeLimitada && (
        <div style={s.matchOverlay} onClick={() => setShowSwipeLimitada(false)}>
          <div style={s.matchCard} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 46 }}>🔒</div>
            <h2 style={{ color: '#fff', margin: '12px 0 8px' }}>Sin swipes disponibles</h2>
            <p style={{ color: '#aaa', fontSize: 13, marginBottom: 20 }}>
              Usaste todos tus swipes de hoy. Se recargan mañana o con Finder Plus 🔥
            </p>
            <button style={s.btnChat} onClick={() => { setShowSwipeLimitada(false); navigate('/premium'); }}>
              ⭐ Ver planes Premium
            </button>
            <button style={s.btnSeguir} onClick={() => setShowSwipeLimitada(false)}>Volver mañana</button>
          </div>
        </div>
      )}

      {showFiltros && <FiltrosPanel filtros={filtros} onChange={aplicarFiltros} onClose={() => setShowFiltros(false)} />}
      {storyActiva && <StoryViewer story={storyActiva} onClose={() => setStoryActiva(null)} />}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0d0d0d', overflow: 'hidden' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px 6px', flexShrink: 0 },
  topLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  topTitle: { fontSize: 26, fontWeight: 900, background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  boostBadge: { backgroundColor: 'rgba(255,79,106,0.15)', border: '1px solid #FF4F6A', color: '#FF4F6A', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 },
  topActions: { display: 'flex', alignItems: 'center', gap: 8 },
  swipesCounter: { color: '#FF8C42', fontSize: 12, fontWeight: 700, backgroundColor: 'rgba(255,140,66,0.1)', border: '1px solid rgba(255,140,66,0.3)', borderRadius: 20, padding: '3px 10px' },
  matchesBtn: { background: 'none', border: '1px solid #FF4F6A', borderRadius: 20, padding: '4px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#FF4F6A' },
  matchesBadge: { backgroundColor: '#FF4F6A', color: '#fff', borderRadius: 10, padding: '0 6px', fontSize: 11, fontWeight: 800 },
  filtrosBtn: { background: 'none', border: '1px solid #444', borderRadius: 20, padding: '6px 12px', cursor: 'pointer', color: '#ddd', fontSize: 16, position: 'relative', display: 'flex', alignItems: 'center', gap: 4 },
  filtrosBadge: { backgroundColor: '#FF4F6A', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stack: { flex: 1, position: 'relative', margin: '0 16px', minHeight: 0 },
  card: { position: 'absolute', inset: 0, borderRadius: 20, overflow: 'hidden', backgroundColor: '#1a1a1a', userSelect: 'none', touchAction: 'none' },
  cardBack: { position: 'absolute', inset: '8px 12px 0', borderRadius: 20, overflow: 'hidden', opacity: 0.55, transform: 'scale(0.95)', transformOrigin: 'bottom', pointerEvents: 'none' },
  foto: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' },
  fotoDots: { position: 'absolute', top: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 4, pointerEvents: 'none' },
  dot: { width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fff' },
  tagLike: { position: 'absolute', top: 44, right: 20, padding: '6px 18px', borderRadius: 8, fontSize: 22, fontWeight: 900, border: '3px solid #4CAF50', color: '#4CAF50', transform: 'rotate(-15deg)', pointerEvents: 'none', transition: 'opacity 0.1s' },
  tagNope: { position: 'absolute', top: 44, left: 20, padding: '6px 18px', borderRadius: 8, fontSize: 22, fontWeight: 900, border: '3px solid #F44336', color: '#F44336', transform: 'rotate(15deg)', pointerEvents: 'none', transition: 'opacity 0.1s' },
  likeOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, #4CAF50)', pointerEvents: 'none' },
  nopeOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to left, transparent, #F44336)', pointerEvents: 'none' },
  intencionBadge: { position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '4px 14px', color: '#fff', fontSize: 12, fontWeight: 600, pointerEvents: 'none', whiteSpace: 'nowrap' },
  info: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.92) 40%)', padding: '40px 16px 16px', pointerEvents: 'none' },
  infoTop: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 },
  nombreEdad: { fontSize: 22, fontWeight: 800, color: '#fff' },
  verificado: { color: '#4FC3F7', fontSize: 16 },
  onlineDot: { width: 10, height: 10, borderRadius: '50%', backgroundColor: '#4CAF50', border: '2px solid #fff' },
  distancia: { color: '#ccc', fontSize: 13, marginBottom: 4 },
  bio: { color: '#ddd', fontSize: 13, margin: '4px 0 8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  intereses: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  tag2: { backgroundColor: 'rgba(255,79,106,0.2)', color: '#FF4F6A', border: '1px solid #FF4F6A', borderRadius: 20, padding: '2px 10px', fontSize: 11 },
  botones: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, padding: '12px 20px', flexShrink: 0 },
  btnRewind: { width: 44, height: 44, borderRadius: '50%', border: '2px solid #FFD700', backgroundColor: 'transparent', color: '#FFD700', fontSize: 18, cursor: 'pointer' },
  btnNope: { width: 62, height: 62, borderRadius: '50%', border: '2px solid #F44336', backgroundColor: 'transparent', color: '#F44336', fontSize: 26, cursor: 'pointer', transition: 'transform 0.15s' },
  btnStar: { width: 50, height: 50, borderRadius: '50%', border: '2px solid #4FC3F7', backgroundColor: 'transparent', color: '#4FC3F7', fontSize: 20, cursor: 'pointer' },
  btnLike: { width: 62, height: 62, borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', color: '#fff', fontSize: 26, cursor: 'pointer', transition: 'transform 0.15s' },
  btnBoost: { width: 44, height: 44, borderRadius: '50%', border: '2px solid #FF4F6A', backgroundColor: 'transparent', color: '#FF4F6A', fontSize: 18, cursor: 'pointer' },
  agotado: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d0d0d', gap: 4 },
  btnReload: { background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', border: 'none', color: '#fff', padding: '14px 32px', borderRadius: 30, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  matchOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  matchCard: { backgroundColor: '#1a1a1a', borderRadius: 24, padding: '32px 28px', textAlign: 'center', maxWidth: 320, width: '90%' },
  matchFotos: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 },
  matchFoto: { width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #FF4F6A' },
  btnChat: { display: 'block', width: '100%', background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', border: 'none', color: '#fff', padding: '14px', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 10 },
  btnSeguir: { display: 'block', width: '100%', backgroundColor: 'transparent', border: '1px solid #333', color: '#aaa', padding: '12px', borderRadius: 14, fontSize: 14, cursor: 'pointer' },
};
