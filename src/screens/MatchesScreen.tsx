import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Perfil } from '../data/perfiles';

type Tab = 'gustaron' | 'nuevos' | 'mensajes';

function formatExpira(ts?: number): string | null {
  if (!ts) return null;
  const diff = ts - Date.now();
  if (diff <= 0) return 'Expirado';
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function LikeCard({ perfil, desbloqueado, onMatch }: { perfil: Perfil; desbloqueado: boolean; onMatch: (p: Perfil) => void }) {
  const navigate = useNavigate();

  if (!desbloqueado) {
    return (
      <div style={lg.card} onClick={() => navigate('/premium')}>
        <div style={lg.fotoWrap}>
          <img src={perfil.fotos[0]} alt="" style={{ ...lg.foto, filter: 'blur(12px) brightness(0.5)' }} />
          <div style={lg.lock}>🔒</div>
        </div>
        <p style={lg.nombre}>???</p>
      </div>
    );
  }

  return (
    <div style={lg.card} onClick={() => onMatch(perfil)}>
      <div style={lg.fotoWrap}>
        <img src={perfil.fotos[0]} alt={perfil.nombre} style={lg.foto} />
        {perfil.online && <span style={lg.onlineDot} />}
        <div style={lg.compatChip}>{perfil.compatibilidad}%</div>
      </div>
      <p style={lg.nombre}>{perfil.nombre}, {perfil.edad}</p>
    </div>
  );
}

const lg: Record<string, React.CSSProperties> = {
  card: { cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  fotoWrap: { position: 'relative', width: 90, height: 110, borderRadius: 16, overflow: 'hidden' },
  foto: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  lock: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 },
  onlineDot: { position: 'absolute', bottom: 6, right: 6, width: 12, height: 12, borderRadius: '50%', backgroundColor: '#4CAF50', border: '2px solid #0d0d0d' },
  compatChip: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(255,79,106,0.85)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 6px' },
  nombre: { color: '#ccc', fontSize: 12, margin: 0, textAlign: 'center' },
};

export default function MatchesScreen() {
  const { matches, addMatch, likesRecibidos, premium } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('gustaron');

  const totalNuevos = matches.reduce((s, m) => s + m.nuevos, 0);
  const desbloqueado = premium === 'gold' || premium === 'platinum';
  const sinMensajes = matches.filter(m => m.mensajes.length === 0);
  const conMensajes = matches.filter(m => m.mensajes.length > 0);

  const handleMatchDesdeGustaron = (perfil: Perfil) => {
    addMatch(perfil);
    navigate(`/chat/${perfil.id}`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.titulo}>
          Matches {totalNuevos > 0 && <span style={styles.badge}>{totalNuevos}</span>}
        </h2>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {([['gustaron', 'Te gustaron'], ['nuevos', 'Nuevos'], ['mensajes', 'Mensajes']] as [Tab, string][]).map(([key, label]) => (
          <button key={key} style={{ ...styles.tab, ...(tab === key ? styles.tabActivo : {}) }} onClick={() => setTab(key)}>
            {label}
            {key === 'mensajes' && totalNuevos > 0 && <span style={styles.tabBadge}>{totalNuevos}</span>}
          </button>
        ))}
      </div>

      {/* Tab: Te gustaron */}
      {tab === 'gustaron' && (
        <div style={styles.scroll}>
          {/* Banner premium si no desbloqueado */}
          {!desbloqueado && (
            <div style={styles.premiumBanner} onClick={() => navigate('/premium')}>
              <div style={styles.premiumBannerLeft}>
                <span style={styles.premiumBannerEmoji}>⭐</span>
                <div>
                  <p style={styles.premiumBannerTitulo}>{likesRecibidos.length} personas te dieron like</p>
                  <p style={styles.premiumBannerSub}>Desbloqueá con Finder Gold para verlas</p>
                </div>
              </div>
              <span style={styles.premiumBannerCta}>Ver →</span>
            </div>
          )}
          {desbloqueado && (
            <p style={styles.secLabel}>{likesRecibidos.length} personas te dieron like 💛</p>
          )}
          <div style={styles.likesGrid}>
            {likesRecibidos.map((p, i) => (
              <LikeCard key={p.id} perfil={p} desbloqueado={desbloqueado || i < 2} onMatch={handleMatchDesdeGustaron} />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Nuevos matches */}
      {tab === 'nuevos' && (
        <div style={styles.scroll}>
          <p style={styles.secLabel}>Deciles hola antes que expire ⏱</p>
          {sinMensajes.length === 0 ? (
            <div style={styles.vacioCentro}>
              <div style={{ fontSize: 48 }}>🔥</div>
              <p style={{ color: '#666' }}>Swipeá para conseguir matches</p>
            </div>
          ) : (
            <div style={styles.nuevosGrid}>
              {sinMensajes.map(m => {
                const expira = formatExpira(m.expira);
                return (
                  <div key={m.perfil.id} style={styles.nuevoItem} onClick={() => navigate(`/chat/${m.perfil.id}`)}>
                    <div style={styles.nuevoFotoWrap}>
                      <img src={m.perfil.fotos[0]} alt={m.perfil.nombre} style={styles.nuevoFoto} />
                      {m.perfil.online && <span style={styles.onlineDot} />}
                    </div>
                    <p style={styles.nuevoNombre}>{m.perfil.nombre}</p>
                    {expira && <p style={{ ...styles.expiraBadge, color: expira === 'Expirado' ? '#F44336' : '#FF8C42' }}>{expira}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Mensajes */}
      {tab === 'mensajes' && (
        <div style={styles.lista}>
          {conMensajes.length === 0 ? (
            <div style={styles.vacioCentro}>
              <div style={{ fontSize: 48 }}>💬</div>
              <p style={{ color: '#666' }}>Enviá un mensaje a tus matches</p>
            </div>
          ) : (
            conMensajes.map(m => {
              const ultimo = m.mensajes[m.mensajes.length - 1];
              return (
                <div key={m.perfil.id} style={styles.chatItem} onClick={() => navigate(`/chat/${m.perfil.id}`)}>
                  <div style={styles.fotoWrap}>
                    <img src={m.perfil.fotos[0]} alt={m.perfil.nombre} style={styles.chatFoto} />
                    {m.perfil.online && <span style={styles.onlineDotChat} />}
                  </div>
                  <div style={styles.chatInfo}>
                    <div style={styles.chatTop}>
                      <span style={styles.chatNombre}>{m.perfil.nombre}</span>
                      <span style={styles.chatHora}>{ultimo.hora}</span>
                    </div>
                    <div style={styles.chatBottom}>
                      <span style={styles.chatUltimo}>
                        {ultimo.autorId === 'yo' ? 'Vos: ' : ''}
                        {ultimo.texto}
                      </span>
                      {m.nuevos > 0 && <span style={styles.chatBadge}>{m.nuevos}</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0d0d0d', overflow: 'hidden' },
  header: { padding: '16px 20px 8px', flexShrink: 0 },
  titulo: { fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 },
  badge: { backgroundColor: '#FF4F6A', color: '#fff', borderRadius: 12, padding: '2px 8px', fontSize: 13 },
  tabs: { display: 'flex', gap: 0, padding: '0 16px', borderBottom: '1px solid #222', flexShrink: 0 },
  tab: { flex: 1, padding: '10px 0', background: 'none', border: 'none', color: '#666', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderBottom: '2px solid transparent', transition: 'all 0.2s', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  tabActivo: { color: '#FF4F6A', borderBottomColor: '#FF4F6A' },
  tabBadge: { backgroundColor: '#FF4F6A', color: '#fff', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 },
  scroll: { flex: 1, overflowY: 'auto' as const, padding: '12px 16px' },
  premiumBanner: { background: 'linear-gradient(135deg, rgba(255,79,106,0.15), rgba(255,140,66,0.15))', border: '1px solid rgba(255,79,106,0.3)', borderRadius: 16, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' },
  premiumBannerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  premiumBannerEmoji: { fontSize: 28 },
  premiumBannerTitulo: { color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 },
  premiumBannerSub: { color: '#888', fontSize: 12, margin: '2px 0 0' },
  premiumBannerCta: { color: '#FF4F6A', fontWeight: 700, fontSize: 14 },
  secLabel: { color: '#888', fontSize: 13, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  likesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  nuevosGrid: { display: 'flex', flexWrap: 'wrap', gap: 16 },
  nuevoItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' },
  nuevoFotoWrap: { position: 'relative' },
  nuevoFoto: { width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', border: '3px solid #FF4F6A' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: '50%', backgroundColor: '#4CAF50', border: '2px solid #0d0d0d' },
  nuevoNombre: { color: '#ddd', fontSize: 12, margin: 0, maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
  expiraBadge: { fontSize: 10, fontWeight: 700, margin: 0 },
  lista: { flex: 1, overflowY: 'auto' as const },
  chatItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #1a1a1a' },
  fotoWrap: { position: 'relative', flexShrink: 0 },
  chatFoto: { width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' },
  onlineDotChat: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', backgroundColor: '#4CAF50', border: '2px solid #0d0d0d' },
  chatInfo: { flex: 1, minWidth: 0 },
  chatTop: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 },
  chatNombre: { color: '#fff', fontWeight: 700, fontSize: 15 },
  chatHora: { color: '#555', fontSize: 12 },
  chatBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  chatUltimo: { color: '#888', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, maxWidth: 200 },
  chatBadge: { backgroundColor: '#FF4F6A', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 },
  vacioCentro: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 8 },
};
