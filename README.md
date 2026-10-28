# 📌 Pinterest Clone

A full-stack Pinterest-inspired visual discovery platform built with React, TypeScript, Node.js, MongoDB, and Clerk authentication. Features a personalised masonry feed driven by user interest weights and cursor-based pagination.

---

## ✨ Features

### Implemented ✅

| Area | Feature |
|---|---|
| **Auth** | Clerk-powered sign-in (Google SSO, email/password) |
| **Auth** | Clerk→Backend JWT sync — single token strategy for all API calls |
| **Onboarding** | Interest picker (choose 5 topics from 16 categories) |
| **Onboarding** | Topics saved as a weighted `Map<tag, weight>` on the user |
| **Feed** | Personalised masonry pin feed from real backend API |
| **Feed** | Cursor-based infinite scroll (IntersectionObserver) |
| **Feed** | Feed filtered + ranked by user interest weights |
| **Feed** | Loading / empty / error states with retry |
| **Pins** | Pin model with `title`, `imageUrl`, `width`, `height`, `tags`, `saveCount` |
| **Interests** | Interest bumping on view / click / save (`+1` / `+1` / `+3`) |
| **UI** | Responsive sidebar + top header dashboard layout |
| **UI** | Masonry grid with hover overlay (title + save count) |
| **Pages** | Marketing home, About, Businesses, News, Create |
| **Dev** | Database seed script (28 sample pins across all 16 topics) |

### Upcoming 🚧

- [ ] Pin detail modal / page
- [ ] Save / unsave pin (save to boards)
- [ ] Boards — create, edit, delete
- [ ] Pin upload (image to Cloudinary → create pin)
- [ ] Search (full-text index already on the Pin model)
- [ ] User profile page with saved pins + created pins
- [ ] Follow / unfollow users
- [ ] Notifications
- [ ] Comments on pins
- [ ] Explore page (curated topics grid)
- [ ] Dark mode

---

## 🏗️ Tech Stack

### Frontend
| | |
|---|---|
| Framework | React 18 + Vite 7 |
| Language | TypeScript 5.9 |
| Routing | React Router DOM v6 |
| Auth | Clerk React SDK |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion + GSAP |
| Icons | Lucide React + React Icons |
| Masonry grid | `react-masonry-css` |
| State / data | Custom hooks (`useFeed`, `useClerkSync`, `useInterestBump`) |

### Backend
| | |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express 4 |
| Database | MongoDB via Mongoose 8 |
| Auth | JWT (`jsonwebtoken`) + Clerk sync |
| Password hashing | bcrypt |
| Media | Cloudinary (configured, upload endpoint coming) |
| Dev server | ts-node-dev |

---

## 📁 Project Structure

```
pinterest/
├── frontend/                    # React + Vite app
│   └── src/
│       ├── Pages/
│       │   ├── Home.tsx          # Public marketing page
│       │   ├── Dashboard.tsx     # Authenticated feed (← dynamic, API-driven)
│       │   ├── Onboarding.tsx    # Interest picker (first login)
│       │   ├── Create.tsx        # Pin creation page
│       │   ├── About.tsx
│       │   ├── Businesses.tsx
│       │   ├── News.tsx
│       │   └── SSOCallback.tsx   # Clerk OAuth redirect handler
│       ├── Components/
│       │   ├── MasonryGrid1.tsx  # Masonry pin grid (Pin[])
│       │   ├── Sidebar.tsx       # Dashboard icon sidebar
│       │   ├── TopHeader.tsx     # Search bar + Clerk UserButton
│       │   ├── HeroSection.tsx
│       │   ├── FeaturesSection.tsx
│       │   └── ...               # Marketing page components
│       ├── hooks/
│       │   ├── useFeed.ts        # Cursor-paginated feed fetcher
│       │   ├── useClerkSync.ts   # Clerk→JWT sync + /api/user/me
│       │   └── useInterestBump.ts # Fire-and-forget interest weight bumper
│       ├── layouts/
│       │   ├── DashboardLayout.tsx
│       │   └── MainLayout.tsx
│       ├── lib/
│       │   └── api.ts            # Fetch wrapper with Bearer token injection
│       └── App.tsx               # Routes + auth guards
│
└── backend/                     # Express API
    └── src/
        ├── modules/
        │   ├── auth/
        │   │   ├── auth.model.ts      # User schema (interests Map)
        │   │   ├── auth.service.ts    # register / login / clerkSync
        │   │   ├── auth.controller.ts
        │   │   └── auth.routes.ts
        │   ├── pin/
        │   │   ├── pin.model.ts       # Pin schema (tags, imageUrl, width/height)
        │   │   ├── pin.controller.ts  # getFeed, getPinById
        │   │   └── pin.routes.ts
        │   ├── user/
        │   │   ├── user.controller.ts # getMe, setInterests, bumpInterests
        │   │   └── user.routes.ts
        │   └── board/                 # (stub — Stage 4)
        ├── middleware/
        │   └── auth.middleware.ts     # requireAuth (JWT verify)
        ├── config/
        │   └── db.ts                  # MongoDB connection
        ├── scripts/
        │   └── seedPins.ts            # Dev seed (28 pins, all 16 topics)
        ├── App.ts                     # Express app setup + route mounting
        └── server.ts                  # HTTP listener
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB running locally on `mongodb://127.0.0.1:27017`
- A [Clerk](https://clerk.com) account + application

### 1. Clone & install

```bash
git clone https://github.com/yourname/pinterest-clone.git
cd pinterest-clone

# Install both projects
cd backend  && npm install
cd ../frontend && npm install
```

### 2. Environment variables

**`backend/.env`**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pinterest_clone
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**`frontend/.env.local`**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:5000
```

### 3. Seed the database

```bash
cd backend
npx ts-node src/scripts/seedPins.ts
# ✓ inserted 28 pins across 16 topic categories
```

### 4. Run both servers

```bash
# Terminal 1 — backend
cd backend && npm run dev
# 🚀 Server running on http://localhost:5000
# ✅ MongoDB connected successfully

# Terminal 2 — frontend
cd frontend && npm run dev
# ➜  Local: http://localhost:5173
```

---

## 🔌 API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ✗ | Email/password registration |
| `POST` | `/api/auth/login` | ✗ | Email/password login → JWT |
| `POST` | `/api/auth/clerk-sync` | ✗ | Clerk identity → backend JWT |

### User

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/user/me` | ✅ | Get authenticated user profile |
| `POST` | `/api/user/interests` | ✅ | Set onboarding interests (weight 3) |
| `POST` | `/api/user/interests/bump` | ✅ | Bump tag weights (view +1, click +1, save +3) |

### Pins / Feed

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/pins/feed` | ✅ | Personalised feed filtered by user interests |
| `GET` | `/api/pins/:id` | ✅ | Single pin by ID |

#### `GET /api/pins/feed` — Query params

| Param | Type | Default | Description |
|---|---|---|---|
| `cursor` | ISO 8601 string | — | Fetch pins older than this timestamp |
| `limit` | number | `20` | Results per page (max 50) |

#### Response shape
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Mountain sunrise over alpine lake",
      "imageUrl": "https://images.unsplash.com/...",
      "width": 600,
      "height": 800,
      "tags": ["nature", "landscape", "mountains"],
      "saveCount": 142,
      "createdAt": "2026-10-27T04:12:31.000Z"
    }
  ],
  "nextCursor": "2026-10-27T04:12:00.000Z"
}
```

---

## 🧠 How the Feed Works

```
1. User signs in with Clerk
2. useClerkSync → POST /api/auth/clerk-sync → receives backend JWT
3. If no interests → redirect to /onboarding
4. User picks 5 topics → POST /api/user/interests
   Tags saved as { nature: 3, landscape: 3, travel: 3, ... }
5. /dashboard mounts → useFeed → GET /api/pins/feed
6. Backend reads user.interests Map, sorts by weight (highest first)
7. Pin.find({ tags: { $in: userTags } }).sort({ createdAt: -1 })
8. Returns paginated pins
9. MasonryGrid1 renders them; IntersectionObserver triggers next page load
10. As user interacts → useInterestBump bumps weights silently
    (view: +1, click: +1, save: +3) — feed becomes more personalised over time
```

---

## 🗺️ Roadmap

### Stage 1 — Auth & Onboarding ✅
- Clerk integration + JWT sync
- Interest picker + weight storage

### Stage 2 — Feed ✅
- Pin model + seed data
- Personalised feed API with cursor pagination
- Masonry infinite scroll UI

### Stage 3 — Pins (Next)
- Cloudinary image upload
- Create pin form (title, description, tags, image)
- Pin detail page / modal
- Save / unsave pin

### Stage 4 — Boards
- Create / edit / delete boards
- Add / remove pins from boards
- Public board pages

### Stage 5 — Social
- Follow / unfollow users
- User profile pages
- Notifications
- Comments on pins

### Stage 6 — Discovery
- Full-text search (index already set on Pin model)
- Explore page (topic browse)
- Trending pins

### Stage 7 — Polish
- Dark mode
- PWA / mobile optimisations
- Analytics events
- Performance: image lazy-load + blur-up placeholders

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/pin-upload`
3. Commit: `git commit -m "feat: add Cloudinary image upload"`
4. Push and open a PR

---

## 📄 License

MIT