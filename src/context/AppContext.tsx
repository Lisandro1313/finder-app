import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Perfil, Match, Mensaje, PlanPremium } from '../data/perfiles';
import { MATCHES_INICIALES, LIKES_RECIBIDOS } from '../data/perfiles';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Toast {
  id: number;
  tipo: 'match' | 'mensaje' | 'boost' | 'info';
  texto: string;
  foto?: string;
}

export interface MiPerfil {
  nombre: string;
  edad: number;
  bio: string;
  foto: string;
}

interface AppContextType {
  // Matches & chat
  matches: Match[];
  addMatch: (perfil: Perfil) => void;
  enviarMensaje: (matchId: number, texto: string) => void;
  marcarLeido: (matchId: number) => void;
  toggleReaccion: (matchId: number, msgId: number, emoji: string) => void;
  isTyping: Record<number, boolean>;

  // Swipes
  swipesRestantes: number;
  superLikesRestantes: number;
  gastarSwipe: () => boolean;
  gastarSuperLike: () => boolean;

  // Rewind
  ultimoSwipe: { perfil: Perfil; dir: 'like' | 'nope' } | null;
  guardarUltimoSwipe: (perfil: Perfil, dir: 'like' | 'nope') => void;
  rewind: () => Perfil | null;

  // Boost
  boostActivo: boolean;
  boostRestante: number; // segundos
  activarBoost: () => void;

  // Premium
  premium: PlanPremium;
  comprarPremium: (plan: PlanPremium) => void;

  // "Te gustaron"
  likesRecibidos: Perfil[];

  // Toasts
  toasts: Toast[];
  addToast: (t: Omit<Toast, 'id'>) => void;
  removeToast: (id: number) => void;

  // Mi perfil
  miPerfil: MiPerfil;
  setMiPerfil: (p: Partial<MiPerfil>) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const HOY = new Date().toDateString();

function loadSwipes(): number {
  try {
    const raw = localStorage.getItem('finder_swipes');
    if (!raw) return 50;
    const parsed = JSON.parse(raw) as { fecha: string; restantes: number };
    if (parsed.fecha !== HOY) return 50;
    return parsed.restantes;
  } catch { return 50; }
}

function saveSwipes(n: number) {
  localStorage.setItem('finder_swipes', JSON.stringify({ fecha: HOY, restantes: n }));
}

function loadSuperLikes(): number {
  try {
    const raw = localStorage.getItem('finder_superlikes');
    if (!raw) return 5;
    const parsed = JSON.parse(raw) as { fecha: string; restantes: number };
    if (parsed.fecha !== HOY) return 5;
    return parsed.restantes;
  } catch { return 5; }
}

function saveSuperLikes(n: number) {
  localStorage.setItem('finder_superlikes', JSON.stringify({ fecha: HOY, restantes: n }));
}

function loadPremium(): PlanPremium {
  return (localStorage.getItem('finder_premium') as PlanPremium) || 'free';
}

// ── Context ───────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | null>(null);

const RESPUESTAS = [
  '¡Qué bueno! 😊', 'Jaja sí, totalmente de acuerdo', '¿Y vos? Contame más 😄',
  'Me parece genial! 🙌', 'Eso me encanta ❤️', '¡Tenemos que encontrarnos!',
  'Jaja te banco 💯', 'Hmm... me hacés pensar 🤔', '¡Exacto, eso mismo pienso yo!',
  'Ay, eso me gustó mucho 😍', 'Contame más, me interesa 👀', 'Siii!! Cuándo?? 😏',
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>(MATCHES_INICIALES);
  const [swipesRestantes, setSwipesRestantes] = useState(loadSwipes);
  const [superLikesRestantes, setSuperLikesRestantes] = useState(loadSuperLikes);
  const [ultimoSwipe, setUltimoSwipe] = useState<{ perfil: Perfil; dir: 'like' | 'nope' } | null>(null);
  const [boostActivo, setBoostActivo] = useState(false);
  const [boostRestante, setBoostRestante] = useState(0);
  const [premium, setPremium] = useState<PlanPremium>(loadPremium);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isTyping, setIsTyping] = useState<Record<number, boolean>>({});
  const [miPerfil, setMiPerfilState] = useState<MiPerfil>({
    nombre: 'Lisandro', edad: 28, bio: 'Buscando algo real 🔥', foto: 'https://picsum.photos/seed/miperfil/400/400',
  });

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setToasts(prev => [...prev.slice(-2), { ...t, id }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(x => x.id !== id));
  }, []);

  const addMatch = useCallback((perfil: Perfil) => {
    setMatches(prev => {
      if (prev.find(m => m.perfil.id === perfil.id)) return prev;
      const expira = Date.now() + 24 * 60 * 60 * 1000;
      return [{ perfil, mensajes: [], nuevos: 0, expira }, ...prev];
    });
  }, []);

  const enviarMensaje = useCallback((matchId: number, texto: string) => {
    const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    setMatches(prev => prev.map(m => {
      if (m.perfil.id !== matchId) return m;
      const nuevoMsg: Mensaje = { id: Date.now(), autorId: 'yo', texto, hora, leido: true };
      return { ...m, mensajes: [...m.mensajes, nuevoMsg] };
    }));

    // Show typing indicator
    setIsTyping(prev => ({ ...prev, [matchId]: true }));

    setTimeout(() => {
      setIsTyping(prev => ({ ...prev, [matchId]: false }));
      const respuesta = RESPUESTAS[Math.floor(Math.random() * RESPUESTAS.length)];
      const hora2 = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
      setMatches(prev2 => prev2.map(m2 => {
        if (m2.perfil.id !== matchId) return m2;
        return {
          ...m2,
          mensajes: [...m2.mensajes, {
            id: Date.now() + 1, autorId: matchId, texto: respuesta, hora: hora2, leido: false,
          }],
          nuevos: m2.nuevos + 1,
        };
      }));
    }, 1500 + Math.random() * 1000);
  }, []);

  const marcarLeido = useCallback((matchId: number) => {
    setMatches(prev => prev.map(m =>
      m.perfil.id === matchId
        ? { ...m, nuevos: 0, mensajes: m.mensajes.map(msg => ({ ...msg, leido: true })) }
        : m
    ));
  }, []);

  const toggleReaccion = useCallback((matchId: number, msgId: number, emoji: string) => {
    setMatches(prev => prev.map(m => {
      if (m.perfil.id !== matchId) return m;
      return {
        ...m,
        mensajes: m.mensajes.map(msg => {
          if (msg.id !== msgId) return msg;
          return { ...msg, reaccion: msg.reaccion === emoji ? undefined : emoji };
        }),
      };
    }));
  }, []);

  const gastarSwipe = useCallback((): boolean => {
    if (premium !== 'free') return true;
    if (swipesRestantes <= 0) return false;
    const nuevo = swipesRestantes - 1;
    setSwipesRestantes(nuevo);
    saveSwipes(nuevo);
    return true;
  }, [premium, swipesRestantes]);

  const gastarSuperLike = useCallback((): boolean => {
    if (superLikesRestantes <= 0) return false;
    const nuevo = superLikesRestantes - 1;
    setSuperLikesRestantes(nuevo);
    saveSuperLikes(nuevo);
    return true;
  }, [superLikesRestantes]);

  const guardarUltimoSwipe = useCallback((perfil: Perfil, dir: 'like' | 'nope') => {
    setUltimoSwipe({ perfil, dir });
  }, []);

  const rewind = useCallback((): Perfil | null => {
    if (!ultimoSwipe) return null;
    const p = ultimoSwipe.perfil;
    setUltimoSwipe(null);
    return p;
  }, [ultimoSwipe]);

  const activarBoost = useCallback(() => {
    setBoostActivo(true);
    setBoostRestante(30 * 60);
    addToast({ tipo: 'boost', texto: '🚀 ¡Boost activo! Sos el más visto por 30 min' });

    let remaining = 30 * 60;
    const timer = setInterval(() => {
      remaining -= 1;
      setBoostRestante(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        setBoostActivo(false);
        setBoostRestante(0);
        addToast({ tipo: 'info', texto: '⏱ Tu Boost terminó. ¡Mirá cuántos nuevos matches!' });
      }
    }, 1000);
  }, [addToast]);

  const comprarPremium = useCallback((plan: PlanPremium) => {
    setPremium(plan);
    localStorage.setItem('finder_premium', plan);
    if (plan !== 'free') {
      setSwipesRestantes(999);
      addToast({ tipo: 'info', texto: `✨ ¡Bienvenido a Finder ${plan.charAt(0).toUpperCase() + plan.slice(1)}!` });
    }
  }, [addToast]);

  const setMiPerfil = useCallback((p: Partial<MiPerfil>) => {
    setMiPerfilState(prev => ({ ...prev, ...p }));
  }, []);

  return (
    <AppContext.Provider value={{
      matches, addMatch, enviarMensaje, marcarLeido, toggleReaccion, isTyping,
      swipesRestantes, superLikesRestantes, gastarSwipe, gastarSuperLike,
      ultimoSwipe, guardarUltimoSwipe, rewind,
      boostActivo, boostRestante, activarBoost,
      premium, comprarPremium,
      likesRecibidos: LIKES_RECIBIDOS,
      toasts, addToast, removeToast,
      miPerfil, setMiPerfil,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp fuera de AppProvider');
  return ctx;
}
