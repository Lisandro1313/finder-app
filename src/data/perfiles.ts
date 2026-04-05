export type Intencion = 'casual' | 'seria' | 'amigos' | 'sorprendeme';
export type PlanPremium = 'free' | 'plus' | 'gold' | 'platinum';

export interface Perfil {
  id: number;
  nombre: string;
  edad: number;
  ciudad: string;
  pais: string;
  distancia: number;
  bio: string;
  intereses: string[];
  fotos: string[];
  genero: 'mujer' | 'hombre' | 'nb';
  verificado: boolean;
  online: boolean;
  compatibilidad: number;
  intencion: Intencion;
}

export interface Mensaje {
  id: number;
  autorId: number | 'yo';
  texto: string;
  hora: string;
  leido: boolean;
  reaccion?: string;
}

export interface Match {
  perfil: Perfil;
  mensajes: Mensaje[];
  nuevos: number;
  expira?: number; // timestamp en ms (24h para decir hola - estilo Bumble)
}

const INT_LABELS: Record<Intencion, string> = {
  casual: '🔥 Casual',
  seria: '💍 Relación seria',
  amigos: '👫 Amigos / Lo que surja',
  sorprendeme: '✨ Sorprendeme',
};
export const getIntencionLabel = (i: Intencion) => INT_LABELS[i];

export const PERFILES: Perfil[] = [
  // Buenos Aires
  {
    id: 1, nombre: 'Valentina', edad: 26, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 1,
    bio: 'Bailarina y amante del café 💃 Busco alguien que me saque a bailar o al menos lo intente 😂',
    intereses: ['Baile', 'Café', 'Viajes', 'Yoga'],
    fotos: ['https://picsum.photos/seed/val1/400/600', 'https://picsum.photos/seed/val2/400/600', 'https://picsum.photos/seed/val3/400/600'],
    genero: 'mujer', verificado: true, online: true, compatibilidad: 94, intencion: 'casual',
  },
  {
    id: 2, nombre: 'Sofía', edad: 29, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 3,
    bio: 'Médica residente 🏥 Me encanta cocinar, el cine indie y los dogs. Tengo un golden llamado Mochi 🐕',
    intereses: ['Medicina', 'Cocina', 'Cine', 'Perros'],
    fotos: ['https://picsum.photos/seed/sof1/400/600', 'https://picsum.photos/seed/sof2/400/600'],
    genero: 'mujer', verificado: true, online: false, compatibilidad: 88, intencion: 'seria',
  },
  {
    id: 3, nombre: 'Camila', edad: 23, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 2,
    bio: 'Diseñadora gráfica 🎨 Amante del arte, la música en vivo y los planes espontáneos.',
    intereses: ['Arte', 'Diseño', 'Música', 'Fotografía'],
    fotos: ['https://picsum.photos/seed/cam1/400/600', 'https://picsum.photos/seed/cam2/400/600', 'https://picsum.photos/seed/cam3/400/600'],
    genero: 'mujer', verificado: false, online: true, compatibilidad: 91, intencion: 'sorprendeme',
  },
  {
    id: 4, nombre: 'Lucía', edad: 31, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 5,
    bio: 'Periodista 📰 Apasionada del running y el buen vino 🍷 Si tenés buenas recomendaciones hablemos 😏',
    intereses: ['Running', 'Vino', 'Periodismo', 'Viajes'],
    fotos: ['https://picsum.photos/seed/luc1/400/600'],
    genero: 'mujer', verificado: true, online: true, compatibilidad: 85, intencion: 'casual',
  },
  {
    id: 5, nombre: 'Martina', edad: 25, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 7,
    bio: 'Instructora de pilates 💪 Vegana, viajera, aventurera. Busco alguien con energía positiva 🌻',
    intereses: ['Pilates', 'Fitness', 'Veganismo', 'Naturaleza'],
    fotos: ['https://picsum.photos/seed/mar1/400/600', 'https://picsum.photos/seed/mar2/400/600'],
    genero: 'mujer', verificado: false, online: false, compatibilidad: 79, intencion: 'amigos',
  },
  {
    id: 6, nombre: 'Isabella', edad: 28, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 4,
    bio: 'Arquitecta 🏛️ Fanática del mate, el ajedrez y los libros de terror. Prometo ser más interesante que mi bio 😅',
    intereses: ['Arquitectura', 'Ajedrez', 'Lectura', 'Mate'],
    fotos: ['https://picsum.photos/seed/isa1/400/600', 'https://picsum.photos/seed/isa2/400/600'],
    genero: 'mujer', verificado: true, online: true, compatibilidad: 96, intencion: 'seria',
  },
  {
    id: 7, nombre: 'Julieta', edad: 22, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 2,
    bio: 'Estudiante de psicología 🧠 Me gustan las conversaciones profundas, los gatos y el karaoke 🎤',
    intereses: ['Psicología', 'Gatos', 'Karaoke', 'Series'],
    fotos: ['https://picsum.photos/seed/jul1/400/600', 'https://picsum.photos/seed/jul2/400/600'],
    genero: 'mujer', verificado: false, online: true, compatibilidad: 82, intencion: 'sorprendeme',
  },
  {
    id: 8, nombre: 'Florencia', edad: 34, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 6,
    bio: 'Chef profesional 🍳 Trabajo en un restaurante de Palermo. Los sábados hago brunch en casa 😋',
    intereses: ['Cocina', 'Gastronomía', 'Vino', 'Arte'],
    fotos: ['https://picsum.photos/seed/flo1/400/600', 'https://picsum.photos/seed/flo2/400/600', 'https://picsum.photos/seed/flo3/400/600'],
    genero: 'mujer', verificado: true, online: false, compatibilidad: 87, intencion: 'casual',
  },
  // Más Argentina
  {
    id: 9, nombre: 'Rocío', edad: 27, ciudad: 'Rosario', pais: 'Argentina', distancia: 12,
    bio: 'Abogada ⚖️ Muy fanática del rock nacional y el mate amargo. Sin drama please 🙏',
    intereses: ['Rock', 'Derecho', 'Viajes', 'Cine'],
    fotos: ['https://picsum.photos/seed/roc1/400/600', 'https://picsum.photos/seed/roc2/400/600'],
    genero: 'mujer', verificado: true, online: true, compatibilidad: 80, intencion: 'casual',
  },
  {
    id: 10, nombre: 'Emilia', edad: 24, ciudad: 'Córdoba', pais: 'Argentina', distancia: 15,
    bio: 'Estudiante de música 🎵 Toco la guitarra, canto en el baño y busco audiencia tolerante 😂',
    intereses: ['Música', 'Guitarra', 'Café', 'Libros'],
    fotos: ['https://picsum.photos/seed/emi1/400/600'],
    genero: 'mujer', verificado: false, online: true, compatibilidad: 88, intencion: 'amigos',
  },
  // Global
  {
    id: 11, nombre: 'Valentina M.', edad: 25, ciudad: 'Ciudad de México', pais: 'México', distancia: 25,
    bio: 'Tatuadora 🎨 La vida es corta para no tener tatuajes. Busco aventuras y conexiones reales.',
    intereses: ['Tatuajes', 'Arte', 'Skate', 'Música'],
    fotos: ['https://picsum.photos/seed/mex1/400/600', 'https://picsum.photos/seed/mex2/400/600'],
    genero: 'mujer', verificado: true, online: true, compatibilidad: 86, intencion: 'casual',
  },
  {
    id: 12, nombre: 'Gabriela', edad: 30, ciudad: 'Madrid', pais: 'España', distancia: 40,
    bio: 'Enfermera de noche, bailarina de día 💃 El flamenco y el techno no se contradicen.',
    intereses: ['Baile', 'Música', 'Viajes', 'Gastronomía'],
    fotos: ['https://picsum.photos/seed/esp1/400/600', 'https://picsum.photos/seed/esp2/400/600'],
    genero: 'mujer', verificado: true, online: false, compatibilidad: 79, intencion: 'sorprendeme',
  },
  {
    id: 13, nombre: 'Carolina', edad: 28, ciudad: 'Bogotá', pais: 'Colombia', distancia: 30,
    bio: 'Influencer de viajes ✈️ 42 países visitados, el mundo es demasiado grande para quedarse quieta.',
    intereses: ['Viajes', 'Fotografía', 'Surf', 'Yoga'],
    fotos: ['https://picsum.photos/seed/col1/400/600', 'https://picsum.photos/seed/col2/400/600', 'https://picsum.photos/seed/col3/400/600'],
    genero: 'mujer', verificado: true, online: true, compatibilidad: 92, intencion: 'amigos',
  },
  {
    id: 14, nombre: 'Ana Paula', edad: 26, ciudad: 'São Paulo', pais: 'Brasil', distancia: 35,
    bio: 'Model & artista 🌺 Falo português e um pouco de español. La energía es todo.',
    intereses: ['Arte', 'Moda', 'Música', 'Playa'],
    fotos: ['https://picsum.photos/seed/bra1/400/600', 'https://picsum.photos/seed/bra2/400/600'],
    genero: 'mujer', verificado: false, online: true, compatibilidad: 83, intencion: 'casual',
  },
  {
    id: 15, nombre: 'Sofía R.', edad: 32, ciudad: 'Santiago', pais: 'Chile', distancia: 20,
    bio: 'Sommelier 🍷 Trabajo catando vinos y buscando al que los disfrute conmigo. Eso sos vos?',
    intereses: ['Vinos', 'Gastronomía', 'Montaña', 'Lectura'],
    fotos: ['https://picsum.photos/seed/chi1/400/600'],
    genero: 'mujer', verificado: true, online: false, compatibilidad: 90, intencion: 'seria',
  },
];

// Perfiles que YA te dieron like (visible en "Te gustaron")
export const LIKES_RECIBIDOS: Perfil[] = [
  {
    id: 301, nombre: 'Natalia', edad: 27, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 2,
    bio: 'Psicóloga 🧠 Amo los perros, el cine y el café de especialidad.',
    intereses: ['Psicología', 'Perros', 'Cine'],
    fotos: ['https://picsum.photos/seed/nat1/400/600'],
    genero: 'mujer', verificado: true, online: true, compatibilidad: 95, intencion: 'seria',
  },
  {
    id: 302, nombre: 'Mora', edad: 24, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 1,
    bio: 'DJ de fin de semana, contadora de semana 🎧 La contradicción me define.',
    intereses: ['Música', 'Electrónica', 'Finanzas'],
    fotos: ['https://picsum.photos/seed/mor1/400/600'],
    genero: 'mujer', verificado: false, online: true, compatibilidad: 88, intencion: 'casual',
  },
  {
    id: 303, nombre: 'Cecilia', edad: 31, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 4,
    bio: 'Fotógrafa 📷 Viajé a 20 países con mi cámara. Próximo destino: vos.',
    intereses: ['Fotografía', 'Viajes', 'Arte'],
    fotos: ['https://picsum.photos/seed/cec1/400/600'],
    genero: 'mujer', verificado: true, online: false, compatibilidad: 91, intencion: 'sorprendeme',
  },
  {
    id: 304, nombre: 'Renata B.', edad: 29, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 3,
    bio: 'Actriz y maestra de teatro 🎭 La vida es demasiado corta para no actuar.',
    intereses: ['Teatro', 'Cine', 'Literatura'],
    fotos: ['https://picsum.photos/seed/renb1/400/600'],
    genero: 'mujer', verificado: false, online: true, compatibilidad: 84, intencion: 'amigos',
  },
  {
    id: 305, nombre: 'Lara', edad: 23, ciudad: 'Montevideo', pais: 'Uruguay', distancia: 18,
    bio: 'Veterinaria 🐾 Si no te gustan los animales, no voy a funcionar contigo.',
    intereses: ['Animales', 'Naturaleza', 'Running'],
    fotos: ['https://picsum.photos/seed/lar1/400/600'],
    genero: 'mujer', verificado: true, online: false, compatibilidad: 87, intencion: 'seria',
  },
  {
    id: 306, nombre: 'Pilar', edad: 26, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 5,
    bio: 'Sommelier 🍷 y cocinera amateur. El vino es el idioma del alma.',
    intereses: ['Vino', 'Cocina', 'Viajes', 'Arte'],
    fotos: ['https://picsum.photos/seed/pil1/400/600'],
    genero: 'mujer', verificado: false, online: true, compatibilidad: 93, intencion: 'casual',
  },
  {
    id: 307, nombre: 'Valentina C.', edad: 28, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 2,
    bio: 'Startup founder 🚀 Apasionada por la tecnología y los helados de dulce de leche.',
    intereses: ['Tech', 'Emprendimiento', 'Running'],
    fotos: ['https://picsum.photos/seed/valc1/400/600'],
    genero: 'mujer', verificado: true, online: true, compatibilidad: 97, intencion: 'seria',
  },
  {
    id: 308, nombre: 'Luna', edad: 22, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 1,
    bio: 'Barista ☕ Hago el mejor flat white de Palermo. Viniste a testear mi claim?',
    intereses: ['Café', 'Arte', 'Música', 'Yoga'],
    fotos: ['https://picsum.photos/seed/lun1/400/600'],
    genero: 'mujer', verificado: false, online: true, compatibilidad: 89, intencion: 'casual',
  },
  {
    id: 309, nombre: 'Abril', edad: 30, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 6,
    bio: 'Biotecnóloga 🔬 De día salvo el mundo, de noche bailo salsa. Las dos cosas son verdad.',
    intereses: ['Ciencia', 'Salsa', 'Lectura', 'Viajes'],
    fotos: ['https://picsum.photos/seed/abr1/400/600'],
    genero: 'mujer', verificado: true, online: false, compatibilidad: 85, intencion: 'sorprendeme',
  },
  {
    id: 310, nombre: 'Catalina', edad: 27, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 3,
    bio: 'Directora de cine 🎬 Mis pelis están en el BAFICI. Mi corazón está disponible.',
    intereses: ['Cine', 'Arte', 'Literatura', 'Viajes'],
    fotos: ['https://picsum.photos/seed/cat1/400/600'],
    genero: 'mujer', verificado: true, online: true, compatibilidad: 92, intencion: 'seria',
  },
];

export const MATCHES_INICIALES: Match[] = [
  {
    perfil: {
      id: 101, nombre: 'Renata', edad: 27, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 1,
      bio: 'Cantante indie 🎵 Busco banda o media naranja, lo que llegue primero.',
      intereses: ['Música', 'Conciertos', 'Viajes'],
      fotos: ['https://picsum.photos/seed/ren1/400/600'],
      genero: 'mujer', verificado: true, online: true, compatibilidad: 93, intencion: 'sorprendeme',
    },
    nuevos: 2,
    mensajes: [
      { id: 1, autorId: 101, texto: '¡Hola! Vi que también te gusta la música en vivo 🎶', hora: '10:30', leido: true },
      { id: 2, autorId: 'yo', texto: '¡Sí! ¿Vas seguido a shows? Yo soy fanático de los festivales', hora: '10:45', leido: true },
      { id: 3, autorId: 101, texto: 'Siempre jaja el mes pasado fui a 3 seguidos', hora: '11:00', leido: true },
      { id: 4, autorId: 101, texto: '¿Qué géneros te gustan? 🎸', hora: '11:01', leido: false },
    ],
  },
  {
    perfil: {
      id: 102, nombre: 'Agustina', edad: 30, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 3,
      bio: 'Abogada de día, cocinera de noche 👩‍⚖️🍜',
      intereses: ['Derecho', 'Cocina', 'Running', 'Viajes'],
      fotos: ['https://picsum.photos/seed/agu1/400/600'],
      genero: 'mujer', verificado: false, online: false, compatibilidad: 89, intencion: 'seria',
    },
    nuevos: 0,
    mensajes: [
      { id: 1, autorId: 'yo', texto: 'Hola! Leí tu bio y tengo curiosidad... ¿qué preparás esta noche? 😄', hora: 'Ayer', leido: true },
      { id: 2, autorId: 102, texto: 'Haha justo estaba probando un ramen casero! Quedó espectacular 🍜', hora: 'Ayer', leido: true },
    ],
  },
  {
    perfil: {
      id: 103, nombre: 'Milagros', edad: 24, ciudad: 'Buenos Aires', pais: 'Argentina', distancia: 2,
      bio: 'Fotógrafa 📷 El mundo es más bonito por el lente.',
      intereses: ['Fotografía', 'Arte', 'Viajes', 'Café'],
      fotos: ['https://picsum.photos/seed/mil1/400/600'],
      genero: 'mujer', verificado: true, online: true, compatibilidad: 91, intencion: 'casual',
    },
    nuevos: 1,
    mensajes: [
      { id: 1, autorId: 103, texto: '¡Match! 🎉', hora: 'Hoy', leido: false },
    ],
    expira: Date.now() + 20 * 60 * 60 * 1000, // expira en 20 horas
  },
];
