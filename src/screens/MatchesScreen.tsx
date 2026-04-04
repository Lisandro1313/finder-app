import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function MatchesScreen() {
  const { matches } = useApp();
  const navigate = useNavigate();

  const totalNuevos = matches.reduce((s, m) => s + m.nuevos, 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.titulo}>Matches {totalNuevos > 0 && <span style={styles.badge}>{totalNuevos}</span>}</h2>
      </div>

      {/* Nuevos matches (solo los sin mensajes o recientes) */}
      <div style={styles.nuevosSection}>
        <p style={styles.secLabel}>Nuevos matches</p>
        <div style={styles.nuevosRow}>
          {matches.filter(m => m.mensajes.length === 0).map(m => (
            <div key={m.perfil.id} style={styles.nuevoItem} onClick={() => navigate(`/chat/${m.perfil.id}`)}>
              <div style={styles.nuevoFotoWrap}>
                <img src={m.perfil.fotos[0]} alt={m.perfil.nombre} style={styles.nuevoFoto} />
                {m.perfil.online && <span style={styles.onlineDot} />}
              </div>
              <p style={styles.nuevoNombre}>{m.perfil.nombre}</p>
            </div>
          ))}
          {matches.filter(m => m.mensajes.length === 0).length === 0 && (
            <p style={styles.vacio}>Swipeá para conseguir matches 🔥</p>
          )}
        </div>
      </div>

      <div style={styles.divider} />

      {/* Lista de chats */}
      <p style={styles.secLabel}>Mensajes</p>
      <div style={styles.lista}>
        {matches.filter(m => m.mensajes.length > 0).map(m => {
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
        })}
        {matches.filter(m => m.mensajes.length > 0).length === 0 && (
          <div style={styles.vacioCentro}>
            <div style={{ fontSize: 48 }}>💬</div>
            <p style={{ color: '#666' }}>Enviá un mensaje a tus matches</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0d0d0d', overflow: 'hidden' },
  header: { padding: '16px 20px 8px', flexShrink: 0 },
  titulo: { fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 },
  badge: { backgroundColor: '#FF4F6A', color: '#fff', borderRadius: 12, padding: '2px 8px', fontSize: 13 },
  secLabel: { color: '#888', fontSize: 13, fontWeight: 600, padding: '8px 16px 4px', margin: 0, textTransform: 'uppercase' as const, letterSpacing: 1 },
  nuevosSection: { flexShrink: 0 },
  nuevosRow: { display: 'flex', gap: 16, padding: '8px 16px 12px', overflowX: 'auto' as const },
  nuevoItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0 },
  nuevoFotoWrap: { position: 'relative' },
  nuevoFoto: { width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', border: '3px solid #FF4F6A' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: '50%', backgroundColor: '#4CAF50', border: '2px solid #0d0d0d' },
  nuevoNombre: { color: '#ddd', fontSize: 12, margin: 0, maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
  vacio: { color: '#555', fontSize: 13, padding: '12px 0' },
  divider: { height: 1, backgroundColor: '#222', margin: '4px 0' },
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
