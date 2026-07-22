# 🎵 CMD Lab — Music & Sound Design Art Collective Platform

> **CMD Lab** is a fast, modern, and aesthetically rich web application built specifically for independent music collectives, sound designers, and audio-visual creators.

---

## 🎨 Product & Vision

### 🌟 Purpose
Traditional music band websites are often built like static promotional brochures. **CMD Lab** was created as a dynamic, living digital hub where an **artistic collective** can showcase its members, publish collaborative releases, stream audio previews, and curate an evolving artistic identity.

Instead of treating the collective as a standard pop group, CMD Lab emphasizes **multidisciplinary creative identity** — featuring music producers, modular synth artists, sound designers, and 3D audio-visual creators under one unified brand.

---

### ✨ Core Features
- **Public Art Showcase**:
  - **Hero & Manifesto**: Ambient glowing soundwave backdrop, slogan, manifesto, and official collective social links (YouTube `@cmd_lab`, YouTube Channel, Instagram `@cmd.lab`).
  - **Artist Roster**: Interactive card grid showcasing collective members, pre-loaded with **Damian Lonare** (`ProdByLonare`) featuring verified Spotify, Apple Music, YouTube, Instagram, and Facebook links.
  - **Persistent Audio Player & Waveform Visualizer**: Global bottom playback bar with audio stream simulation, track progress tracking, and a live Canvas spectrum visualizer.
  - **Video Drop Lightbox (`VideoModal`)**: Embedded YouTube player lightbox for watching collective video drops directly on the site.
  - **Collective Feed**: Announcement posts and project drops.

- **Full-Site Customization & Theme Studio**:
  - **7-Color Theme Customizer**: Real-time color pickers for Primary Accent, Secondary Accent, Glow Neon, Site Background, Card Background, Primary Text, and Secondary Text.
  - **1-Click Theme Presets**: Instant themes (Cyberpunk Neon, Dark Velvet, Synthwave Gold, Emerald Studio, Obsidian Minimal).

- **Multi-Role CMS & Authentication**:
  - **Public Visitor Mode**: Clean, distraction-free showcase for external listeners.
  - **Super Admin Studio**: Full control over site branding, theme colors, announcements, and artist user account creation.
  - **Artist Self-Service Portal**: Individual dashboard for artists to edit their own profile, avatar, bio, streaming links, music tracks, and news updates.

---

### ⚠️ Product Limitations (Current Phase)
1. **Hybrid Storage Engine**:
   - The platform includes a client-side V3 storage cache alongside Supabase integration. Remote cloud syncing requires executing the provided `supabase_setup.sql` in your Supabase project.
2. **Audio Streaming Source**:
   - Track previews currently utilize royalty-free MP3 demo URLs. Production environments should host high-bitrate audio assets on Supabase Storage, AWS S3, or CDN storage.
3. **Single Admin Role Model**:
   - Current admin privileges apply to the site owner account. Advanced role hierarchies (e.g., Editor, Curator, Moderator) can be extended in future releases.

---

### 🚀 Future Roadmap & Possibilities
- [ ] **Event Calendar & Live Streams**: A dedicated "Próximos Eventos / Live Sessions" section for virtual streams, pop-up exhibitions, and live performances.
- [ ] **Sample Packs & Digital Merch Store**: Integrated digital store for selling or sharing royalty-free sample packs, synth presets, and collective merchandise.
- [ ] **Real-Time Interactive Audio Canvas**: Full-screen 3D WebGL / GLSL audio-reactive visualizer reacting to live microphone input or track playback.
- [ ] **Artist Messaging & Collaborations**: Internal messaging channel for collective members to share project stems and request track feedback.

---

## 🛠️ Technical Architecture & Stack

### ⚡ Technology Stack
- **Frontend Core**: React 18 + Vite (for ultra-fast HMR and bundle compilation).
- **Styling & Aesthetics**: Tailwind CSS (v4) with dynamic CSS Variable utilities (`var(--color-primary)`, `var(--color-bg)`, etc.).
- **Icons & Visuals**: Lucide React + Custom SVG Brand Icons (`SocialIcon.jsx`).
- **Data & Schema Layer**: Executable GraphQL schema layer (`src/graphql/schema.js`) + LocalStorage V3 persistent caching engine.
- **Backend & Database**: **Supabase** (PostgreSQL database, Row-Level Security, and Auth client SDK `@supabase/supabase-js`).
- **Audio & Video**: HTML5 Audio API + Canvas Webform Spectrum Visualizer (`WaveformVisualizer.jsx`) + YouTube Embed Lightbox (`VideoModal.jsx`).

---

### 📁 Directory Structure
```text
cmdlab-antigravity/
├── public/
│   ├── favicon.svg
│   └── _redirects            # Netlify / Cloudflare Pages SPA fallback rule
├── src/
│   ├── assets/               # Static images and brand assets
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx  # 7-Color Theme Studio & User Management
│   │   │   ├── ArtistPortal.jsx    # Artist self-service profile dashboard
│   │   │   └── AuthModal.jsx       # Login & Sign Up modal (React Portal)
│   │   ├── ArtistDetailModal.jsx   # Full member biography and tracks modal
│   │   ├── ArtistRoster.jsx        # Grid of collective members & audio previews
│   │   ├── AudioPlayerBar.jsx      # Persistent bottom audio player
│   │   ├── HeroSection.jsx         # Manifesto hero & video drop visualizer
│   │   ├── Navbar.jsx              # Header with logo, smooth links & auth toggle
│   │   ├── NewsFeed.jsx            # Collective updates and releases feed
│   │   ├── SocialIcon.jsx          # SVG brand icons (Spotify, Apple, YT, IG, FB)
│   │   ├── VideoModal.jsx          # Lightbox iFrame player for YouTube drops
│   │   └── WaveformVisualizer.jsx  # Real-time HTML5 Canvas audio spectrum
│   ├── graphql/
│   │   ├── GraphQLContext.jsx      # Global state, theme & Supabase sync engine
│   │   ├── initialData.js          # Pre-seeded Spanish collective dataset
│   │   └── schema.js               # GraphQL SDL type definitions
│   ├── lib/
│   │   └── supabase.js             # Supabase client helper
│   ├── App.jsx                     # Root application container
│   ├── index.css                   # Dynamic CSS variables & Tailwind imports
│   └── main.jsx                    # React root entry point
├── .env                            # Supabase URL & anon key config
├── index.html                      # SEO & OpenGraph social sharing meta tags
├── supabase_setup.sql              # Database schema, RLS policies & seed data
├── vercel.json                     # Vercel SPA rewrite configuration
└── package.json
```

---

## 🔧 Local Development & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/damianlonare/cmdlab-antigravity.git
   cd cmdlab-antigravity
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://hpsrvudjizfrivozcnyb.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Start the local development server:
   ```bash
   npm run dev
   ```
   Open **`http://localhost:5173/`** in your web browser.

5. Test production build:
   ```bash
   npm run build
   ```

---

## 🗄️ Database Setup (Supabase)

To connect your live Supabase PostgreSQL database:

1. Open your Supabase Dashboard: **[supabase.com](https://supabase.com)**
2. Navigate to **SQL Editor**.
3. Copy the contents of [`supabase_setup.sql`](./supabase_setup.sql) and click **Run**.
4. This creates the required tables (`profiles`, `site_settings`, `social_links`, `tracks`, `posts`) along with Row-Level Security (RLS) policies.

---

## 🌐 Deployment (Vercel)

This project is configured for **Vercel** deployment:

1. Go to **[vercel.com/new](https://vercel.com/new)** and import `damianlonare/cmdlab-antigravity`.
2. Add your environment variables under **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Click **Deploy**. Vercel will automatically build and publish your application.

---

## 📜 License & Credits

- **Collective**: **CMD Lab Art Collective**
- **Founder**: **Damian Lonare** (`ProdByLonare`)
- **License**: MIT License
