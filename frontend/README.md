# 💻 Drishyaa - Frontend Application Client

This is the client-side user interface repository for **Drishyaa**, an immersive, full-stack video streaming application. Built using **React 18** and **Vite**, the interface features a responsive layout, a customized HTML5 media player dashboard, real-time context state management, and smooth glassmorphic interface designs driven by Tailwind CSS and Framer Motion.

**Live Link** - https://drishyaa-tv.vercel.app/

## 🛠️ Tech Stack & Key Libraries

- **Core UI Library:** React 18 (Functional components utilizing hooks)
- **Build Tooling:** Vite (Fast dev server and optimized rollup build system)
- **Routing Engine:** React Router DOM v6 (Client-side route matching)
- **Styling System:** Tailwind CSS (Semantic utility utility variables, custom light/dark configurations)
- **Animation Framework:** Framer Motion (Spring physics transitions, active layout pill tracking)
- **Data Transport:** Axios Client Instance (Configured with request and response interceptors)
- **Icon Vector Assets:** React Icons (Lucide, FontAwesome, and Material design packs)

---

## 📂 Architecture & Directory Tree

```text
src/
├── components/         # Reusable global presentation items
│   ├── AnimatedButton.jsx  # Context-driven visual button framework
│   ├── FilterButtons.jsx   # Taxonomy row with sliding layoutId active pill
│   ├── Header.jsx          # Upper global navigation search overlay bar
│   ├── Sidebar.jsx         # Collapsible sliding drawer navigation array
│   ├── Toast.jsx           # Timed floating error/success alert pop window
│   ├── VideoCard.jsx       # Grid thumbnail content cell container
│   └── VideoSkeleton.jsx   # Shimmer template slot box fallback
├── context/            # Global context state sync hubs
│   ├── AuthContext.jsx     # Session initialization and registration routing hooks
│   ├── PlaylistContext.jsx # Local arrays sync (History, Playlists, Watch Later)
│   └── ThemeContext.jsx    # DOM document element class dark/light state skin manager
├── pages/              # Primary route layout views
│   ├── AuthPage.jsx        # Validation-driven credential login/signup switch
│   ├── ChannelPage.jsx     # Studio workspace creation panel form dashboard
│   ├── Home.jsx            # Dynamic media query landing feed route space
│   └── VideoDetails.jsx    # Playback theater workspace dashboard view
└── services/
    └── api.js          # Central Axios client instance with 401 interceptor checks