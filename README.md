# 🎬 Drishyaa — Full-Stack Video Streaming Ecosystem

**Drishyaa** is a premium, full-stack video streaming and content creation platform engineered using the MERN stack (**MongoDB, Express.js, React, Node.js**). The application delivers an interactive, high-performance user experience modeled after modern streaming services, featuring fluid micro-interactions, complete light/dark mode support, and a highly responsive layout that scales seamlessly across mobile, tablet, and desktop viewports.

The project is structured as a monorepo containing decoupled client and server environments, prioritizing clean code organization, security guardrails, and optimal production performance.

# FRONT-END [ Deploying from GitHub to Vercel ]

**GITHUB LINK** - https://github.com/rajesh36sarkar/Drishyaa.git
**LIVE PREVIEW** - https://drishyaa-tv.vercel.app/  

# FRONT-END [ Deploying from GitHub to Render ]

**GITHUB LINK** - https://github.com/rajesh36sarkar/Drishyaa-backend.git
**Live Link** - https://drishya-backend.onrender.com/


## 📂 System Project File Tree Mapping


drishyaa-workspace/
├── backend/                  # Server-Side Architecture Engine
│   ├── middleware/
│   │   └── auth.js             # JWT Route Guard Security Interceptor
│   ├── models/                 # Mongoose Database Data Schemas
│   │   ├── Channel.js          # Studio Channel Space Properties Map
│   │   ├── Comment.js          # Flat User Discussion Schema Map
│   │   ├── User.js             # Account Access & Credentials Map
│   │   └── Video.js            # Video Streaming Parameters Map
│   ├── routes/                 # Express REST Api Controllers
│   │   ├── auth.js             # Signup & Login Logic Controllers
│   │   ├── channels.js         # Channel Allocation & Creator Hubs
│   │   ├── comments.js         # Single-level Comment System CRUD
│   │   └── videos.js           # Filtering, Regex Search, & Content Maps
│   └── server.js               # Application Entry Point & Core Connections
│
└── frontend/                 # Client-Side User Interface
    └── src/
        ├── components/         # Reusable Global UI (Header, Sidebar, VideoCard)
        ├── context/            # Global State Hubs (Auth, Playlists, Themes)
        ├── pages/              # Primary Route Views (Home, AuthPage, VideoDetails)
        ├── services/
        │   └── api.js          # Central Interceptor-Guarded Axios Client
        ├── index.css           # Global CSS Variables & Tailwind Sheets
        └── main.jsx            # React Entry Root Initialization Shell
