import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { PlanPremium } from '../data/perfiles';

interface PlanInfo {
  id: PlanPremium;
  nombre: string;
  emoji: string;
  color: string;
  precioMes: number;
  precioAnual: number;
  features: string[];
  destacado?: boolean;
}

const PLANES: PlanInfo[] = [
  {
    id: 'plus',
    nombre: 'Finder Plus',
    emoji: '⚡',
    color: '#FF8C42',
    precioMes: 9.99,
    precioAnual: 5.99,
    features: [
      '✅ Swipes ilimitados',
      '✅ 5 Super Likes por día',
      '✅ Rewind (deshacer swipe)',
      '✅ 1 Boost por mes',
      '✅ Sin publicidad',
      '❌ Ver quién te gustó',
      '❌ Matches prioritarios',
    ],
  },
  {
    id: 'gold',
    nombre: 'Finder Gold',
    emoji: '⭐',
    color: '#FFD700',
    precioMes: 19.99,
    precioAnual: 12.99,
    features: [
      '✅ Todo de Plus',
      '✅ Ver quién te gustó',
      '✅ 5 Boosts por mes',
      '✅ Top Picks diarios',
      '✅ Matches prioritarios',
      '❌ Perfil siempre al tope',
    ],
    destacado: true,
  },
  {
    id: 'platinum',
    nombre: 'Finder Platinum',
    emoji: '💎',
    color: '#4FC3F7',
    precioMes: 29.99,
    precioAnual: 19.99,
    features: [
      '✅ Todo de Gold',
      '✅ Perfil siempre al tope',
      '✅ Boosts ilimitados',
      '✅ Mensajes antes del match',
      '✅ Confirmación de lectura',
      '✅ Soporte prioritario 24/7',
    ],
  },
];

const BENEFICIOS_RAPIDOS = [
  { emoji: '♾️', titulo: 'Swipes infinitos', desc: 'Sin límite diario' },
  { emoji: '👀', titulo: 'Quién te gustó', desc: 'Ves sus fotos claras' },
  { emoji: '↩️', titulo: 'Rewind', desc: 'Deshacé el último swipe' },
  { emoji: '🚀', titulo: 'Boost', desc: 'Aparecé primero 30 min' },
  { emoji: '⭐', titulo: 'Super Likes', desc: 'Destacate más' },
  { emoji: '🌍', titulo: 'Modo Global', desc: 'Conectá con el mundo' },
];

export default function PremiumScreen() {
  const navigate = useNavigate();
  const { premium, comprarPremium } = useApp();
  const [anual, setAnual] = useState(true);
  const [procesando, setProcesando] = useState<PlanPremium | null>(null);

  const handleComprar = (planId: PlanPremium) => {
    if (procesando) return;
    setProcesando(planId);
    setTimeout(() => {
      comprarPremium(planId);
      setProcesando(null);
      navigate('/perfil');
    }, 1200);
  };

  return (
    <div style={s.container}>
      <div style={s.scroll}>
        {/* Header */}
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => navigate(-1)}>←</button>
          <div style={s.headerContent}>
            <div style={s.heroEmoji}>🔥</div>
            <h1 style={s.heroTitulo}>Finder Premium</h1>
            <p style={s.heroSub}>Matches ilimitados. Conexiones reales. Sin límites.</p>
          </div>
        </div>

        {/* Beneficios rápidos */}
        <div style={s.beneficiosGrid}>
          {BENEFICIOS_RAPIDOS.map(b => (
            <div key={b.titulo} style={s.beneficioItem}>
              <span style={s.beneficioEmoji}>{b.emoji}</span>
              <span style={s.beneficioTitulo}>{b.titulo}</span>
              <span style={s.beneficioDesc}>{b.desc}</span>
            </div>
          ))}
        </div>

        {/* Toggle anual/mensual */}
        <div style={s.toggleRow}>
          <button style={{ ...s.toggleBtn, ...(anual ? {} : s.toggleBtnActivo) }} onClick={() => setAnual(false)}>Mensual</button>
          <button style={{ ...s.toggleBtn, ...(anual ? s.toggleBtnActivo : {}) }} onClick={() => setAnual(true)}>
            Anual <span style={s.descuento}>-40%</span>
          </button>
        </div>

        {/* Planes */}
        {PLANES.map(plan => {
          const esCurrent = premium === plan.id;
          const precio = anual ? plan.precioAnual : plan.precioMes;
          return (
            <div key={plan.id} style={{ ...s.planCard, borderColor: plan.destacado ? plan.color : '#222', boxShadow: plan.destacado ? `0 0 20px ${plan.color}30` : 'none' }}>
              {plan.destacado && <div style={{ ...s.popularBadge, backgroundColor: plan.color }}>MÁS POPULAR</div>}
              <div style={s.planHeader}>
                <span style={s.planEmoji}>{plan.emoji}</span>
                <div>
                  <h3 style={{ ...s.planNombre, color: plan.color }}>{plan.nombre}</h3>
                  <div style={s.planPrecioRow}>
                    <span style={{ ...s.planPrecio, color: plan.color }}>${precio.toFixed(2)}</span>
                    <span style={s.planPeriodo}>/ {anual ? 'mes (facturado anual)' : 'mes'}</span>
                  </div>
                </div>
              </div>

              <div style={s.featuresList}>
                {plan.features.map(f => (
                  <p key={f} style={{ ...s.featureItem, color: f.startsWith('✅') ? '#ccc' : '#444' }}>{f}</p>
                ))}
              </div>

              <button
                style={{
                  ...s.btnSuscribir,
                  background: esCurrent ? '#1a1a1a' : `linear-gradient(135deg, ${plan.color}, ${plan.color}aa)`,
                  border: esCurrent ? `1px solid ${plan.color}` : 'none',
                  color: esCurrent ? plan.color : '#fff',
                  opacity: procesando && procesando !== plan.id ? 0.5 : 1,
                }}
                onClick={() => !esCurrent && handleComprar(plan.id)}
                disabled={esCurrent || !!procesando}
              >
                {procesando === plan.id ? '⏳ Procesando...' : esCurrent ? `${plan.emoji} Tu plan actual` : `Elegir ${plan.nombre}`}
              </button>
            </div>
          );
        })}

        {/* Free downgrade */}
        {premium !== 'free' && (
          <button style={s.btnFree} onClick={() => comprarPremium('free')}>
            Volver al plan gratuito
          </button>
        )}

        <p style={s.legal}>Cancelá cuando quieras. Sin permanencia. Los precios son en USD.</p>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0d0d0d', overflow: 'hidden' },
  scroll: { flex: 1, overflowY: 'auto', paddingBottom: 40 },
  header: { position: 'relative', padding: '16px 20px 0' },
  backBtn: { background: 'none', border: 'none', color: '#FF4F6A', fontSize: 22, cursor: 'pointer', padding: '0 4px', marginBottom: 8 },
  headerContent: { textAlign: 'center', padding: '8px 20px 24px' },
  heroEmoji: { fontSize: 52, marginBottom: 8 },
  heroTitulo: { fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg, #FF4F6A, #FF8C42, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px' },
  heroSub: { color: '#888', fontSize: 14, margin: 0 },
  beneficiosGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: '0 16px 20px' },
  beneficioItem: { backgroundColor: '#111', borderRadius: 14, padding: '12px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 },
  beneficioEmoji: { fontSize: 24 },
  beneficioTitulo: { color: '#fff', fontSize: 12, fontWeight: 700 },
  beneficioDesc: { color: '#555', fontSize: 10 },
  toggleRow: { display: 'flex', gap: 0, margin: '0 16px 20px', backgroundColor: '#111', borderRadius: 30, padding: 4 },
  toggleBtn: { flex: 1, padding: '10px', borderRadius: 26, border: 'none', backgroundColor: 'transparent', color: '#666', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  toggleBtnActivo: { backgroundColor: '#FF4F6A', color: '#fff', fontWeight: 700 },
  descuento: { backgroundColor: '#4CAF50', color: '#fff', borderRadius: 10, padding: '2px 6px', fontSize: 10, fontWeight: 800 },
  planCard: { margin: '0 16px 16px', backgroundColor: '#111', borderRadius: 20, padding: 20, border: '1px solid', position: 'relative', overflow: 'hidden' },
  popularBadge: { position: 'absolute', top: 12, right: 12, borderRadius: 10, padding: '3px 10px', fontSize: 10, fontWeight: 800, color: '#fff' },
  planHeader: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 },
  planEmoji: { fontSize: 36 },
  planNombre: { fontWeight: 800, fontSize: 18, margin: '0 0 4px' },
  planPrecioRow: { display: 'flex', alignItems: 'baseline', gap: 4 },
  planPrecio: { fontSize: 26, fontWeight: 900 },
  planPeriodo: { color: '#666', fontSize: 12 },
  featuresList: { marginBottom: 16 },
  featureItem: { margin: '4px 0', fontSize: 13, lineHeight: 1.4 },
  btnSuscribir: { width: '100%', padding: '14px', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' },
  btnFree: { display: 'block', margin: '8px auto', background: 'none', border: 'none', color: '#555', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' },
  legal: { color: '#444', fontSize: 11, textAlign: 'center', padding: '8px 20px 0' },
};
