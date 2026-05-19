# ⚙️ Drishyaa - Backend API Control Surface Engine

This is the server-side architecture and data management engine for **Drishyaa**, an immersive full-stack video streaming application. Developed in **Node.js** with **Express.js** and **MongoDB**, it handles secure credential authentication parsing, validation request middleware filters, complex data schemas with nested populating loops, and asset stream data uploads.

**Live Link** - https://drishya-backend.onrender.com

## 🛠️ Tech Stack & Dependencies

- **Runtime Base:** Node.js (Strict modern ES Module execution configurations)
- **Web Application Matrix:** Express.js Framework (Asynchronous route middleware pattern)
- **Database Modality Connector:** Mongoose ODM (Relational collection indexing models)
- **Session Security:** JsonWebToken (JWT implementation for secure stateless auth)
- **Credentials Encryption:** BcryptJS (Pre-save schema password hashing mechanics)
- **Binary Stream Transit:** Multer Framework (Efficient memory storage buffer processing)
- **Media Hosting Pipeline:** Cloudinary Cloud Video Engine (Streaming upload pipe lines)

---

## 📂 Architecture & Directory Tree

```text
backend/
├── middleware/
│   └── auth.js             # JWT verification interceptor guard middleware
├── models/                 # Mongoose data schema collection entities
│   ├── Channel.js          # Studio creator space model document mapping
│   ├── Comment.js          # Flat user discussion string schema mapping
│   ├── User.js             # Identity access entity credentials model mapping
│   └── Video.js            # Video streaming parameter model document mapping
├── routes/                 # Decoupled REST controller enclaves
│   ├── auth.js             # Signup & login credentials processing controllers
│   ├── channels.js         # Channel allocation and custom studio dashboard managers
│   ├── comments.js         # Single-level discussion message CRUD controllers
│   └── videos.js           # Query filter search, like updates, and video deletion actions
└── server.js               # Entry thread application lifecycle launcher