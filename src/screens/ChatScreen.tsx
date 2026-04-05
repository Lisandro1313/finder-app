import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ICEBREAKERS = [
  '¿Cuál es tu plan ideal para un sábado? 😄',
  'Si pudieras cenar con cualquier persona del mundo, ¿quién sería? 🍝',
  '¿Cuál es la mejor serie que viste últimamente? 📺',
  'Tu foto de perfil me intrigó... ¿qué hay detrás de esa sonrisa? 😏',
  '¿De vacaciones: playa o montaña? 🏖️',
  '¿Mejor forma de conocerse: café, cena o una copa? 🍷',
];

const EMOJI_REACTIONS = ['❤️', '😂', '😮', '😢', '👏', '🔥'];

export default function ChatScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { matches, enviarMensaje, marcarLeido, toggleReaccion, isTyping } = useApp();
  const [texto, setTexto] = useState('');
  const [showReactions, setShowReactions] = useState<number | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const matchId = parseInt(id || '0');
  const match = matches.find(m => m.perfil.id === matchId);
  const typing = isTyping[matchId] ?? false;

  useEffect(() => {
    if (matchId) marcarLeido(matchId);
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [match?.mensajes.length, typing]);

  if (!match) return (
    <div style={{ color: '#fff', padding: 20 }}>
      <button onClick={() => navigate('/matches')} style={styles.backBtn}>← Volver</button>
      <p>Match no encontrado</p>
    </div>
  );

  const enviar = (t?: string) => {
    const msg = (t ?? texto).trim();
    if (!msg) return;
    enviarMensaje(matchId, msg);
    setTexto('');
    setShowEmojis(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
  };

  const EMOJIS_RAPIDOS = ['😍', '🔥', '😂', '👏', '💋', '😏', '🥰', '😘', '👀', '💯'];

  return (
    <div style={styles.container} onClick={() => { setShowReactions(null); setShowEmojis(false); }}>
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
        <div style={styles.headerRight}>
          <span style={styles.compatBadge}>{match.perfil.compatibilidad}% compat.</span>
        </div>
      </div>

      {/* Mensajes */}
      <div style={styles.mensajes}>
        {match.mensajes.length === 0 && (
          <div style={styles.matchBanner}>
            <div style={{ fontSize: 36 }}>🎉</div>
            <p style={{ color: '#FF4F6A', fontWeight: 700 }}>¡Match con {match.perfil.nombre}!</p>
            <p style={{ color: '#888', fontSize: 13 }}>Rompé el hielo 👋</p>

            {/* Icebreakers */}
            <div style={styles.icebreakers}>
              {ICEBREAKERS.slice(0, 3).map((ice, i) => (
                <button key={i} style={styles.icebreakerBtn} onClick={() => enviar(ice)}>
                  {ice}
                </button>
              ))}
            </div>
          </div>
        )}

        {match.mensajes.map(msg => {
          const esYo = msg.autorId === 'yo';
          return (
            <div key={msg.id} style={{ ...styles.msgRow, justifyContent: esYo ? 'flex-end' : 'flex-start' }}>
              {!esYo && <img src={match.perfil.fotos[0]} alt="" style={styles.msgAvatar} />}
              <div style={{ maxWidth: '72%', position: 'relative' }}>
                <div
                  style={{ ...styles.burbuja, ...(esYo ? styles.burbujaYo : styles.burbujaEllos) }}
                  onDoubleClick={() => toggleReaccion(matchId, msg.id, '❤️')}
                  onClick={e => { e.stopPropagation(); setShowReactions(showReactions === msg.id ? null : msg.id); }}
                >
                  {msg.texto}
                </div>
                {msg.reaccion && (
                  <span style={{ ...styles.reaccionBadge, [esYo ? 'left' : 'right']: 4 }}>
                    {msg.reaccion}
                  </span>
                )}
                {showReactions === msg.id && (
                  <div style={{ ...styles.reactionsBar, [esYo ? 'right' : 'left']: 0 }} onClick={e => e.stopPropagation()}>
                    {EMOJI_REACTIONS.map(emoji => (
                      <button key={emoji} style={styles.reactionBtn}
                        onClick={() => { toggleReaccion(matchId, msg.id, emoji); setShowReactions(null); }}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
                <div style={{ ...styles.msgMeta, textAlign: esYo ? 'right' : 'left' }}>
                  {msg.hora} {esYo && (msg.leido ? '✓✓' : '✓')}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div style={{ ...styles.msgRow, justifyContent: 'flex-start' }}>
            <img src={match.perfil.fotos[0]} alt="" style={styles.msgAvatar} />
            <div style={styles.typingBubble}>
              <span style={{ ...styles.typingDot, animationDelay: '0s' }} />
              <span style={{ ...styles.typingDot, animationDelay: '0.15s' }} />
              <span style={{ ...styles.typingDot, animationDelay: '0.3s' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Emojis rápidos */}
      {showEmojis && (
        <div style={styles.emojisRow} onClick={e => e.stopPropagation()}>
          {EMOJIS_RAPIDOS.map(e => (
            <button key={e} style={styles.emojiQuick} onClick={() => setTexto(t => t + e)}>{e}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={styles.inputArea}>
        <button style={styles.emojiBtn} onClick={e => { e.stopPropagation(); setShowEmojis(s => !s); }}>😊</button>
        <input
          style={styles.input}
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={onKey}
          placeholder={`Escribile a ${match.perfil.nombre}...`}
        />
        {texto.trim() ? (
          <button style={styles.sendBtn} onClick={() => enviar()}>➤</button>
        ) : (
          <button style={{ ...styles.sendBtn, background: '#222', color: '#666' }} onClick={() => enviar(ICEBREAKERS[Math.floor(Math.random() * ICEBREAKERS.length)])}>💬</button>
        )}
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
  headerRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 },
  compatBadge: { backgroundColor: 'rgba(255,79,106,0.15)', color: '#FF4F6A', border: '1px solid rgba(255,79,106,0.3)', borderRadius: 12, padding: '2px 8px', fontSize: 11, fontWeight: 700 },
  mensajes: { flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8 },
  matchBanner: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px 16px', gap: 4 },
  icebreakers: { display: 'flex', flexDirection: 'column', gap: 8, width: '100%', marginTop: 12 },
  icebreakerBtn: { backgroundColor: 'rgba(255,79,106,0.1)', border: '1px solid rgba(255,79,106,0.3)', borderRadius: 20, color: '#FF8C42', padding: '10px 16px', fontSize: 13, cursor: 'pointer', textAlign: 'left' },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: 8 },
  msgAvatar: { width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
  burbuja: { padding: '10px 14px', borderRadius: 18, fontSize: 14, lineHeight: 1.4, wordBreak: 'break-word', cursor: 'pointer', userSelect: 'none' },
  burbujaYo: { background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', color: '#fff', borderBottomRightRadius: 4 },
  burbujaEllos: { backgroundColor: '#222', color: '#eee', borderBottomLeftRadius: 4 },
  reaccionBadge: { position: 'absolute', bottom: -10, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 10, padding: '1px 4px', fontSize: 14 },
  reactionsBar: { position: 'absolute', bottom: 36, backgroundColor: '#222', borderRadius: 24, padding: '6px 8px', display: 'flex', gap: 4, zIndex: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.5)' },
  reactionBtn: { background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: '2px 4px' },
  msgMeta: { color: '#555', fontSize: 10, marginTop: 5, padding: '0 4px' },
  typingBubble: { backgroundColor: '#222', borderRadius: 18, borderBottomLeftRadius: 4, padding: '12px 16px', display: 'flex', gap: 4, alignItems: 'center' },
  typingDot: { width: 7, height: 7, borderRadius: '50%', backgroundColor: '#888', animation: 'bounce 1.2s infinite' },
  emojisRow: { display: 'flex', gap: 4, padding: '6px 12px', backgroundColor: '#111', borderTop: '1px solid #1a1a1a', flexWrap: 'wrap' },
  emojiQuick: { background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', padding: '2px 4px' },
  inputArea: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', backgroundColor: '#111', borderTop: '1px solid #222', flexShrink: 0 },
  emojiBtn: { background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' },
  input: { flex: 1, backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: 24, color: '#fff', padding: '10px 16px', fontSize: 14, outline: 'none' },
  sendBtn: { width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg, #FF4F6A, #FF8C42)', color: '#fff', fontSize: 16, cursor: 'pointer' },
};
