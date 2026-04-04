export interface Perfil {
  id: number;
  nombre: string;
  edad: number;
  ciudad: string;
  distancia: number; // km
  bio: string;
  intereses: string[];
  fotos: string[]; // URLs de picsum
  genero: 'mujer' | 'hombre' | 'nb';
  verificado: boolean;
  online: boolean;
  compatibilidad: number; // 60-99%
}

export interface Mensaje {
  id: number;
  autorId: number | 'yo';
  texto: string;
  hora: string;
  leido: boolean;
}

export interface Match {
  perfil: Perfil;
  mensajes: Mensaje[];
  nuevos: number;
}

export const PERFILES: Perfil[] = [
  {
    id: 1, nombre: 'Valentina', edad: 26, ciudad: 'Buenos Aires', distancia: 1,
    bio: 'Bailarina y amante del café 💃 Busco alguien que me saque a bailar o al menos lo intente 😂',
    intereses: ['Baile', 'Café', 'Viajes', 'Yoga'],
    fotos: [
      'https://picsum.photos/seed/val1/400/600',
      'https://picsum.photos/seed/val2/400/600',
      'https://picsum.photos/seed/val3/400/600',
    ],
    genero: 'mujer', verificado: true, online: true, compatibilidad: 94,
  },
  {
    id: 2, nombre: 'Sofía', edad: 29, ciudad: 'Buenos Aires', distancia: 3,
    bio: 'Médica residente 🏥 Me encanta cocinar, el cine indie y los dogs. Tengo un golden retriever llamado Mochi 🐕',
    intereses: ['Medicina', 'Cocina', 'Cine', 'Perros'],
    fotos: [
      'https://picsum.photos/seed/sof1/400/600',
      'https://picsum.photos/seed/sof2/400/600',
    ],
    genero: 'mujer', verificado: true, online: false, compatibilidad: 88,
  },
  {
    id: 3, nombre: 'Camila', edad: 23, ciudad: 'Buenos Aires', distancia: 2,
    bio: 'Diseñadora gráfica 🎨 Amante del arte, la música en vivo y los planes espontáneos. No swipes, seamos personas reales ✨',
    intereses: ['Arte', 'Diseño', 'Música', 'Fotografía'],
    fotos: [
      'https://picsum.photos/seed/cam1/400/600',
      'https://picsum.photos/seed/cam2/400/600',
      'https://picsum.photos/seed/cam3/400/600',
    ],
    genero: 'mujer', verificado: false, online: true, compatibilidad: 91,
  },
  {
    id: 4, nombre: 'Lucía', edad: 31, ciudad: 'Buenos Aires', distancia: 5,
    bio: 'Periodista 📰 Apasionada del running y el buen vino 🍷 Si tenés recomendaciones de restaurantes hablemos 😏',
    intereses: ['Running', 'Vino', 'Periodismo', 'Viajes'],
    fotos: [
      'https://picsum.photos/seed/luc1/400/600',
    ],
    genero: 'mujer', verificado: true, online: true, compatibilidad: 85,
  },
  {
    id: 5, nombre: 'Martina', edad: 25, ciudad: 'Buenos Aires', distancia: 7,
    bio: 'Instructora de pilates y fitness 💪 Vegana, viajera, aventurera. Busco alguien con energía positiva 🌻',
    intereses: ['Pilates', 'Fitness', 'Veganismo', 'Naturaleza'],
    fotos: [
      'https://picsum.photos/seed/mar1/400/600',
      'https://picsum.photos/seed/mar2/400/600',
    ],
    genero: 'mujer', verificado: false, online: false, compatibilidad: 79,
  },
  {
    id: 6, nombre: 'Isabella', edad: 28, ciudad: 'Buenos Aires', distancia: 4,
    bio: 'Arquitecta 🏛️ Fanatica del mate, el ajedrez y los libros de terror. Prometo ser más interesante que mi bio 😅',
    intereses: ['Arquitectura', 'Ajedrez', 'Lectura', 'Mate'],
    fotos: [
      'https://picsum.photos/seed/isa1/400/600',
      'https://picsum.photos/seed/isa2/400/600',
    ],
    genero: 'mujer', verificado: true, online: true, compatibilidad: 96,
  },
  {
    id: 7, nombre: 'Julieta', edad: 22, ciudad: 'Buenos Aires', distancia: 2,
    bio: 'Estudiante de psicología 🧠 Me gustan las conversaciones profundas, los gatos y las noches de karaoke 🎤',
    intereses: ['Psicología', 'Gatos', 'Karaoke', 'Series'],
    fotos: [
      'https://picsum.photos/seed/jul1/400/600',
      'https://picsum.photos/seed/jul2/400/600',
    ],
    genero: 'mujer', verificado: false, online: true, compatibilidad: 82,
  },
  {
    id: 8, nombre: 'Florencia', edad: 34, ciudad: 'Buenos Aires', distancia: 6,
    bio: 'Chef profesional 🍳 Trabajo en un restaurante de Palermo. Los sábados hago brunch en casa y busco quien lo disfrute 😋',
    intereses: ['Cocina', 'Gastronomía', 'Vino', 'Arte'],
    fotos: [
      'https://picsum.photos/seed/flo1/400/600',
      'https://picsum.photos/seed/flo2/400/600',
      'https://picsum.photos/seed/flo3/400/600',
    ],
    genero: 'mujer', verificado: true, online: false, compatibilidad: 87,
  },
];

export const MATCHES_INICIALES: Match[] = [
  {
    perfil: {
      id: 101, nombre: 'Renata', edad: 27, ciudad: 'Buenos Aires', distancia: 1,
      bio: 'Cantante indie 🎵 Busco banda o media naranja, lo que llegue primero.',
      intereses: ['Música', 'Conciertos', 'Viajes'],
      fotos: ['https://picsum.photos/seed/ren1/400/600'],
      genero: 'mujer', verificado: true, online: true, compatibilidad: 93,
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
      id: 102, nombre: 'Agustina', edad: 30, ciudad: 'Buenos Aires', distancia: 3,
      bio: 'Abogada de día, cocinera de noche 👩‍⚖️🍜',
      intereses: ['Derecho', 'Cocina', 'Running', 'Viajes'],
      fotos: ['https://picsum.photos/seed/agu1/400/600'],
      genero: 'mujer', verificado: false, online: false, compatibilidad: 89,
    },
    nuevos: 0,
    mensajes: [
      { id: 1, autorId: 'yo', texto: 'Hola! Leí tu bio y tengo curiosidad... ¿qué preparás esta noche? 😄', hora: 'Ayer', leido: true },
      { id: 2, autorId: 102, texto: 'Haha justo estaba probando un ramen casero! Quedó espectacular 🍜', hora: 'Ayer', leido: true },
    ],
  },
  {
    perfil: {
      id: 103, nombre: 'Milagros', edad: 24, ciudad: 'Buenos Aires', distancia: 2,
      bio: 'Fotógrafa 📷 El mundo es más bonito por el lente.',
      intereses: ['Fotografía', 'Arte', 'Viajes', 'Café'],
      fotos: ['https://picsum.photos/seed/mil1/400/600'],
      genero: 'mujer', verificado: true, online: true, compatibilidad: 91,
    },
    nuevos: 1,
    mensajes: [
      { id: 1, autorId: 103, texto: '¡Match! 🎉', hora: 'Hoy', leido: false },
    ],
  },
];
