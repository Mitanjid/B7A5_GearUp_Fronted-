# GearUp — Rent Sports & Outdoor Gear Instantly 🏋️

GearUp is a responsive **Next.js (App Router)** frontend for a sports and outdoor equipment rental platform. Customers browse gear, pick rental dates, and pay online. Providers manage their inventory and fulfill orders. Admins moderate the whole platform.

> This is a **frontend-only** project — it consumes a separately deployed backend REST API.

---

## 🔗 Live Links

| | |
|---|---|
| **Live Frontend** | `<your-vercel-url-here>` |
| **Backend API** | `<your-render-url-here>` |
| **Frontend Repo** | `<your-github-repo-url-here>` |
| **Demo Video** | `<your-drive-or-loom-link-here>` |

### Admin Test Credentials

```
Email    : <admin-email>
Password : <admin-password>
```

---

## 🚀 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Forms & Validation | React Hook Form + Zod |
| Data Fetching / Cache | TanStack Query (React Query) |
| Global State | Zustand |
| Auth | Custom JWT (stored via `js-cookie`) + Next.js `proxy.ts` route protection |
| Notifications | Sonner (toasts) |
| Theming | next-themes (dark/light mode) |
| Date Handling | date-fns + react-day-picker |

---

## 👥 Roles

| Role | What they can do |
|---|---|
| **Customer** | Browse/filter gear, rent with date picker, checkout & pay, track orders, leave reviews |
| **Provider** | Manage gear inventory (CRUD), view & update incoming rental orders |
| **Admin** | Manage users (suspend/activate), moderate gear & rentals, manage categories |

Role is chosen at registration and drives which dashboard and navigation the UI renders. Routes are protected via `src/proxy.ts` (Next.js 16's route-protection convention, replacing the older `middleware.ts`).

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/            # Public routes: home, /gear, /gear/[id], auth pages
│   │   ├── (authGroup)/     # /login, /register
│   │   └── (geargroup)/     # gear browsing + related actions
│   ├── dashboard/
│   │   ├── customer/        # orders, payments, reviews
│   │   ├── provider/        # gear CRUD, order management
│   │   └── admin/           # users, gear, rentals, categories
│   ├── payment/             # /payment/success, /payment/cancel
│   ├── layout.tsx           # Root layout (ThemeProvider, QueryProvider, Navbar, Toaster)
│   ├── error.tsx / loading.tsx / not-found.tsx
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   └── shared/               # Navbar, ThemeToggle, QueryProvider, etc.
├── lib/
│   ├── api-client.ts         # Central fetch wrapper (attaches JWT, base URL)
│   └── validations/          # Zod schemas
├── store/                    # Zustand stores (auth-store, etc.)
├── types/                    # Shared TypeScript types
└── proxy.ts                  # Route protection (Next.js 16 middleware replacement)
```

---

## ⚙️ Getting Started

### 1. Clone & install

```bash
git clone <your-repo-url>
cd gearup-frontend
npm install
```

### 2. Backend API URL

The backend base URL is currently **hardcoded directly** in `src/lib/api-client.ts` (not read from an environment variable):

```ts
const API_BASE_URL = "<your-deployed-backend-url>";
```

To point the app at a different backend (e.g. local vs. deployed), edit this value directly and rebuild/redeploy — there is no `.env` step for this project.

### 3. Run the dev server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### 4. Build & start (production)

```bash
npm run build
npm run start
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🔐 Authentication Flow

1. User logs in via `/login` → backend returns `accessToken` + user profile.
2. Token and role are stored in cookies (`js-cookie`) and mirrored in a Zustand store for client-side UI state.
3. All authenticated API calls attach `Authorization: Bearer <token>` via `src/lib/api-client.ts`.
4. `src/proxy.ts` reads the role cookie on each request and redirects unauthorized users away from role-specific `/dashboard/*` routes.

---

## 💳 Payment Flow

1. Customer confirms a rental → order created via `POST /api/rentals`.
2. On the pay page, frontend calls `POST /api/payments/create` → backend returns a checkout session URL.
3. Browser redirects to the payment gateway (Stripe/SSLCommerz).
4. Gateway redirects back to `/payment/success` or `/payment/cancel`, where the frontend confirms the session and updates the UI accordingly.

---

## 📄 API Integration

See [`API_INTEGRATION.md`](./API_INTEGRATION.md) for the full mapping of every frontend component/page to its backend endpoint.

---

## ✅ Notes for Reviewers

- The backend base URL is hardcoded in `src/lib/api-client.ts` rather than pulled from a `NEXT_PUBLIC_API_URL` environment variable. If you fork/redeploy this project, update that value directly to point at your own backend.

- Admin & Provider dashboard "stats" cards are computed client-side from existing list endpoints (no dedicated `/stats` endpoint on the backend).
- Gear images are added via URL input (per assignment spec: "image URL uploads"), not a file-upload widget.
- Rental date picker blocks past dates; overlapping already-booked dates are not currently blocked.
