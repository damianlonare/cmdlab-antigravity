export const initialData = {
  siteSettings: {
    siteName: "CMD Lab",
    slogan: "Experimental Music & Sound Design Art Collective",
    manifesto: "CMD Lab is an independent creative collective uniting musicians, producers, sound designers, and visual artists. We create sonic experiences, digital releases, and collaborative audio-visual experiments.",
    primaryColor: "#8b5cf6", // Violet accent
    secondaryColor: "#06b6d4", // Cyan accent
    accentGlow: "#ec4899", // Pink accent
    themeMode: "dark",
    heroAnnouncement: "⚡ CMD Lab Session 01 is now live across streaming platforms!",
    groupSocials: [
      { platform: "YouTube", url: "https://www.youtube.com/@cmd_lab", label: "@cmd_lab" },
      { platform: "YouTube Channel", url: "https://www.youtube.com/channel/UCAeJ43Cwu5gNhtzyiigCGDQ", label: "CMD Lab Channel" },
      { platform: "Instagram", url: "https://www.instagram.com/cmd.lab/", label: "@cmd.lab" }
    ]
  },
  artists: [
    {
      id: "artist-lonare",
      name: "Damian Lonare",
      handle: "ProdByLonare",
      role: "Founder / Music Producer & Sound Designer",
      bio: "Music producer, sound artist, and founder of CMD Lab. Specializing in atmospheric beats, electronic textures, and audio-visual compositions.",
      avatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
      coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80",
      isFounder: true,
      genres: ["Electronic", "Ambient", "Experimental", "Lo-Fi"],
      socialLinks: [
        { platform: "Spotify", url: "https://open.spotify.com/artist/3EQvBlLuI3dCU5aU3wLvGU", label: "Spotify Artist" },
        { platform: "Apple Music", url: "https://music.apple.com/mx/artist/lonare/1607355080", label: "Apple Music" },
        { platform: "YouTube", url: "https://www.youtube.com/@ProdByLonare", label: "@ProdByLonare" },
        { platform: "YouTube Channel", url: "https://www.youtube.com/channel/UCMCDkQj20DUAxCajnkbV50w", label: "Lonare Channel" },
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
          title: "Analog Frequencies",
          duration: "4:12",
          genre: "Electronic / Downtempo",
          releaseDate: "2026-04-10",
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73229.mp3?filename=chill-abstract-intention-12099.mp3",
          coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
          spotifyUrl: "https://open.spotify.com/artist/3EQvBlLuI3dCU5aU3wLvGU"
        }
      ],
      posts: [
        {
          id: "post-1",
          title: "Welcome to CMD Lab's Official Platform",
          content: "We built CMD Lab to serve as an open canvas for collaborative sound creation, generative visuals, and borderless artistic experimentation. Check out our upcoming project drops!",
          createdAt: "2026-07-20",
          tags: ["CMDLab", "Launch", "Collective"],
          mediaUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80"
        }
      ]
    },
    {
      id: "artist-kira",
      name: "Kira Waves",
      handle: "KiraSynth",
      role: "Modular Synth & Sound Sculptor",
      bio: "Generative sound designer working with Eurorack hardware, patch networks, and algorithmic sound design.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      coverImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&auto=format&fit=crop&q=80",
      isFounder: false,
      genres: ["Generative", "Modular", "Industrial Ambient"],
      socialLinks: [
        { platform: "Instagram", url: "https://instagram.com", label: "@kirasynth" },
        { platform: "SoundCloud", url: "https://soundcloud.com", label: "SoundCloud" }
      ],
      tracks: [
        {
          id: "track-3",
          title: "Patch 089: Oscillation",
          duration: "5:04",
          genre: "Modular Ambient",
          releaseDate: "2026-05-02",
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3",
          coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80"
        }
      ],
      posts: [
        {
          id: "post-2",
          title: "Modular Jam Session in the Lab",
          content: "Spent 8 hours patching an analog feedback loop with live tape delay. Excerpt dropping soon on the CMD Lab channel!",
          createdAt: "2026-07-18",
          tags: ["Modular", "Eurorack", "SoundDesign"]
        }
      ]
    },
    {
      id: "artist-vektor",
      name: "Vektor Visuals",
      handle: "VektorArt",
      role: "3D Audio-Visual Artist",
      bio: "Specializing in real-time GLSL shaders, reactive projection mapping, and electronic music production.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
      coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
      isFounder: false,
      genres: ["Audio-Visual", "Glitch", "IDM"],
      socialLinks: [
        { platform: "YouTube", url: "https://youtube.com", label: "Vektor Visuals" },
        { platform: "Instagram", url: "https://instagram.com", label: "@vektor_art" }
      ],
      tracks: [
        {
          id: "track-4",
          title: "Shader Distortion",
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
