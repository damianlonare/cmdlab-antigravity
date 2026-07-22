export const initialData = {
  siteSettings: {
    siteName: "CMD Lab",
    slogan: "Colectivo Artístico de Música & Diseño Sonoro",
    manifesto: "CMD Lab es un colectivo creativo independiente que une a músicos, productores, diseñadores de sonido y artistas visuales. Exploramos paisajes sonoros, lanzamientos digitales y colaboraciones audiovisuales sin fronteras.",
    primaryColor: "#8b5cf6", // Violeta
    secondaryColor: "#06b6d4", // Cían
    accentGlow: "#ec4899", // Rosa neón
    themeMode: "dark",
    heroAnnouncement: "⚡ ¡El nuevo lanzamiento del colectivo CMD Lab ya está disponible!",
    groupSocials: [
      { platform: "YouTube", url: "https://www.youtube.com/@cmd_lab", label: "@cmd_lab" },
      { platform: "YouTube Channel", url: "https://www.youtube.com/channel/UCAeJ43Cwu5gNhtzyiigCGDQ", label: "Canal CMD Lab" },
      { platform: "Instagram", url: "https://www.instagram.com/cmd.lab/", label: "@cmd.lab" }
    ]
  },
  artists: [
    {
      id: "artist-lonare",
      name: "Damian Lonare",
      handle: "ProdByLonare",
      role: "Fundador / Productor Musical & Diseñador Sonoro",
      bio: "Productor musical, compositor y artista sonoro. Fundador de CMD Lab. Especializado en ritmos atmosféricos, texturas electrónicas y producciones audiovisuales.",
      avatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
      coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80",
      isFounder: true,
      genres: ["Electrónica", "Ambient", "Experimental", "Lo-Fi"],
      socialLinks: [
        { platform: "Spotify", url: "https://open.spotify.com/artist/3EQvBlLuI3dCU5aU3wLvGU", label: "Artista en Spotify" },
        { platform: "Apple Music", url: "https://music.apple.com/mx/artist/lonare/1607355080", label: "Apple Music" },
        { platform: "YouTube", url: "https://www.youtube.com/@ProdByLonare", label: "@ProdByLonare" },
        { platform: "YouTube Channel", url: "https://www.youtube.com/channel/UCMCDkQj20DUAxCajnkbV50w", label: "Canal Lonare" },
        { platform: "Instagram", url: "https://www.instagram.com/damianlonare/", label: "@damianlonare" },
        { platform: "Facebook", url: "https://www.facebook.com/search/top?q=lonare", label: "Facebook" }
      ],
      tracks: [
        {
          id: "track-1",
          title: "CMD Resonance",
          duration: "3:45",
          genre: "Ambient Synth",
          releaseDate: "2026-06-15",
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
          coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80",
          spotifyUrl: "https://open.spotify.com/artist/3EQvBlLuI3dCU5aU3wLvGU",
          appleUrl: "https://music.apple.com/mx/artist/lonare/1607355080"
        },
        {
          id: "track-2",
          title: "Frecuencias Análogas",
          duration: "4:12",
          genre: "Electrónica / Downtempo",
          releaseDate: "2026-04-10",
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73229.mp3?filename=chill-abstract-intention-12099.mp3",
          coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
          spotifyUrl: "https://open.spotify.com/artist/3EQvBlLuI3dCU5aU3wLvGU"
        }
      ],
      posts: [
        {
          id: "post-1",
          title: "Bienvenidos al espacio oficial de CMD Lab",
          content: "Creamos CMD Lab como un lienzo abierto para la creación sonora colaborativa, los visuales generativos y la experimentación sin límites. ¡Pronto lanzaremos nuevas producciones!",
          createdAt: "2026-07-20",
          tags: ["CMDLab", "Lanzamiento", "Colectivo"],
          mediaUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80"
        }
      ]
    },
    {
      id: "artist-kira",
      name: "Kira Waves",
      handle: "KiraSynth",
      role: "Especialista en Síntesis Modular",
      bio: "Diseñadora de sonido generativo y exploradora de síntesis análoga. Diseñando texturas sonoras profundas para las producciones de CMD Lab.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      coverImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&auto=format&fit=crop&q=80",
      isFounder: false,
      genres: ["Generativo", "Modular", "Ambient Industrial"],
      socialLinks: [
        { platform: "Instagram", url: "https://instagram.com", label: "@kirasynth" },
        { platform: "SoundCloud", url: "https://soundcloud.com", label: "SoundCloud" }
      ],
      tracks: [
        {
          id: "track-3",
          title: "Oscilación 089",
          duration: "5:04",
          genre: "Ambient Modular",
          releaseDate: "2026-05-02",
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3",
          coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80"
        }
      ],
      posts: [
        {
          id: "post-2",
          title: "Sesión Modular en el Estudio",
          content: "Pasé varias horas creando bucles analógicos con eco de cinta. ¡Pronto compartiremos un extracto en el canal de CMD Lab!",
          createdAt: "2026-07-18",
          tags: ["Modular", "Síntesis", "Sonido"]
        }
      ]
    },
    {
      id: "artist-vektor",
      name: "Vektor Visuals",
      handle: "VektorArt",
      role: "Artista Audiovisual 3D",
      bio: "Especializado en arte visual reactivo, proyecciones inmersivas y producción de música electrónica.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
      coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
      isFounder: false,
      genres: ["Audiovisual", "Glitch", "IDM"],
      socialLinks: [
        { platform: "YouTube", url: "https://youtube.com", label: "Vektor Visuals" },
        { platform: "Instagram", url: "https://instagram.com", label: "@vektor_art" }
      ],
      tracks: [
        {
          id: "track-4",
          title: "Distorsión de Luz",
          duration: "4:30",
          genre: "Glitch / IDM",
          releaseDate: "2026-06-01",
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
          coverUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=80"
        }
      ],
      posts: []
    }
  ]
};
