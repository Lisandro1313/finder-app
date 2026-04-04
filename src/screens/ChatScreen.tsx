import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ChatScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { matches, enviarMensaje, marcarLeido } = useApp();
  const [texto, setTexto] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const matchId = parseInt(id || '0');
  const match = matches.find(m => m.perfil.id === matchId);

  useEffect(() => {
    if (matchId) marcarLeido(matchId);
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [match?.mensajes.length]);

  if (!match) return (
    <div style={{ color: '#fff', padding: 20 }}>
      <button onClick={() => navigate('/matches')} style={styles.backBtn}>← Volver</button>
      <p>Match no encontrado</p>
    </div>
  );

  const enviar = () => {
    const t = texto.trim();
    if (!t) return;
    enviarMensaje(matchId, t);
    setTexto('');
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/matches')} style={styles.backBtn}>←</button>
        <img src={match.perfil.fotos[0]} alt="" style={styles.headerFoto} />
        <div style={styles.headerInfo}>
          <span style={styles.headerNombre}>
            {match.perfil.nombre}
            {match.perfil.verificado && <span style={{ color: '#4FC3F7' }}> ✓</span>}
          </span>
          <span style={styles.headerSub}>
            {match.perfil.online ? '🟢 En línea' : `📍 ${match.perfil.distancia} km`}
          </span>
        </div>
        <button style={styles.infoBtn} onClick={() => {}}>⋯</button>
      </div>

      {/* Mensajes */}
      <div style={styles.mensajes}>
        {match.mensajes.length === 0 && (
          <div style={styles.matchBanner}>
            <div style={{ fontSize: 36 }}>🎉</div>
            <p style={{ color: '#FF4F6A', fontWeight: 700 }}>¡Hiciste match con {match.perfil.nombre}!</p>
            <p style={{ color: '#888', fontSize: 13 }}>Sé el primero en decir hola 👋</p>
          </div>
        )}

        {match.mensajes.map(msg => {
          const esYo = msg.autorId === 'yo';
          return (
            <div key={msg.id} style={{ ...styles.msgRow, justifyContent: esYo ? 'flex-end' : 'flex-start' }}>
              {!esYo && (
                <img src={match.perfil.fotos[0]} alt="" style={styles.msgAvatar} />
              )}
              <div style={{ maxWidth: '70%' }}>
                <div style={{ ...styles.burbuja, ...(esYo ? styles.burbujaYo : styles.burbujaEllos) }}>
                  {msg.texto}
                </div>
                <div style={{ ...styles.msgMeta, textAlign: esYo ? 'right' : 'left' }}>
                  {msg.hora} {esYo && (msg.leido ? '✓✓' : '✓')}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <button style={styles.emojiBtn}>😊</button>
        <input
          style={styles.input}
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={onKey}
          placeholder={`Escribile a ${match.perfil.nombre}...`}
        />
        <button style={styles.sendBtn} onClick={enviar} disabled={!texto.trim()}>
          ➤
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0d0d0d' },
  header: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', backgroundColor: '#111', borderBottom: '1px solid #222', flexShrink: 0 },
  backBtn: { background: 'none', border: 'none', color: '#FF4F6A', fontSize: 22, cursor: 'pointer', padding: '0 4px' },
  headerFoto: { width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' },
  headerInfo: { flex: 1, display: 'flex', flexDirection: 'column' },
  headerNombre: { color: '#fff', fontWeight: 700, fontSize: 16 },
  headerSub: { color: '#888', fontSize: 12 },
  infoBtn: { background: 'none', border: 'none', color: '#888', fontSize: 22, cursor: 'pointer' },
  mensajes: { flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8 },
  matchBanner: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: 6 },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: 8 },
  msgAvatar: { width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
  burbuja: { padding: '10px 14px', borderRadius: 18, fontSize: 14, lineHeight: 1.4, wordBreak: 'break-word' as const },
  burbujaYo: { background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', color: '#fff', borderBottomRightRadius: 4 },
  burbujaEllos: { backgroundColor: '#222', color: '#eee', borderBottomLeftRadius: 4 },
  msgMeta: { color: '#555', fontSize: 10, marginTop: 3, padding: '0 4px' },
  inputArea: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', backgroundColor: '#111', borderTop: '1px solid #222', flexShrink: 0 },
  emojiBtn: { background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' },
  input: { flex: 1, backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: 24, color: '#fff', padding: '10px 16px', fontSize: 14, outline: 'none' },
  sendBtn: { width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', color: '#fff', fontSize: 16, cursor: 'pointer' },
};
