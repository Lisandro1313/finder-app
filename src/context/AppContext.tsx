import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Perfil, Match, Mensaje } from '../data/perfiles';
import { MATCHES_INICIALES } from '../data/perfiles';

interface AppContextType {
  matches: Match[];
  addMatch: (perfil: Perfil) => void;
  enviarMensaje: (matchId: number, texto: string) => void;
  marcarLeido: (matchId: number) => void;
  miPerfil: MiPerfil;
}

export interface MiPerfil {
  nombre: string;
  edad: number;
  bio: string;
  foto: string;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>(MATCHES_INICIALES);
  const miPerfil: MiPerfil = {
    nombre: 'Vos',
    edad: 28,
    bio: 'Activo en Finder 🔥',
    foto: 'https://picsum.photos/seed/miperfil/400/400',
  };

  const addMatch = (perfil: Perfil) => {
    setMatches(prev => {
      if (prev.find(m => m.perfil.id === perfil.id)) return prev;
      return [{ perfil, mensajes: [], nuevos: 0 }, ...prev];
    });
  };

  const enviarMensaje = (matchId: number, texto: string) => {
    const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    setMatches(prev => prev.map(m => {
      if (m.perfil.id !== matchId) return m;
      const nuevoMsg: Mensaje = {
        id: Date.now(),
        autorId: 'yo',
        texto,
        hora,
        leido: true,
      };
      // Simular respuesta automática después de 1.5s
      setTimeout(() => {
        const respuestas = [
          '¡Qué bueno! 😊',
          'Jaja sí, totalmente de acuerdo',
          '¿Y vos? Contame más 😄',
          'Me parece genial! 🙌',
          'Eso me encanta ❤️',
          '¡Tenemos que encontrarnos pronto!',
        ];
        const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
        setMatches(prev2 => prev2.map(m2 => {
          if (m2.perfil.id !== matchId) return m2;
          return {
            ...m2,
            mensajes: [...m2.mensajes, {
              id: Date.now() + 1,
              autorId: matchId,
              texto: respuesta,
              hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
              leido: false,
            }],
            nuevos: m2.nuevos + 1,
          };
        }));
      }, 1500);
      return { ...m, mensajes: [...m.mensajes, nuevoMsg] };
    }));
  };

  const marcarLeido = (matchId: number) => {
    setMatches(prev => prev.map(m =>
      m.perfil.id === matchId
        ? { ...m, nuevos: 0, mensajes: m.mensajes.map(msg => ({ ...msg, leido: true })) }
        : m
    ));
  };

  return (
    <AppContext.Provider value={{ matches, addMatch, enviarMensaje, marcarLeido, miPerfil }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp fuera de AppProvider');
  return ctx;
}
