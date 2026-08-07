# API Integration Map — GearUp Frontend

This document maps every frontend component/page to the backend REST API endpoint(s) it consumes.

## Base URL & Auth

- **Base URL** is hardcoded directly in `src/lib/api-client.ts` (not read from an environment variable).
- All requests go through the central wrapper in `src/lib/api-client.ts`.
- Authenticated requests attach the JWT as `Authorization: Bearer <token>`; the token is read from the cookie/store set at login.

---

## Authentication

| Frontend Component | Action File | Endpoint | Method |
|---|---|---|---|
| `LoginForm` | `login.action.ts` | `/api/auth/login` | `POST` |
| `RegisterForm` | `register.action.ts` | `/api/auth/register` | `POST` |

---

## Public — Gear & Categories

| Frontend Component | Action File | Endpoint | Method |
|---|---|---|---|
| Gear browse page (`/gear`), `FeaturedGear` (home) | `gear.action.ts` (public) | `/api/gear` (query params: `searchTerm`, `category`, `brand`, `minPrice`, `maxPrice`) | `GET` |
| Brand filter dropdown | `gear.action.ts` (public) | `/api/gear/brands` | `GET` |
| `GearDetailsView` (`/gear/[id]`) | `gear.action.ts` (public) | `/api/gear/:id` | `GET` |
| `CategoryStrip` (home), category filters | `category.action.ts` (public) | `/api/categories` | `GET` |
| `ReviewList` (public gear page) | `review.action.ts` (customer) | `/api/reviews/gear/:gearItemId` | `GET` |

---

## Customer

| Frontend Component | Action File | Endpoint | Method |
|---|---|---|---|
| `RentNowDialog` | `rental.action.ts` | `/api/rentals` | `POST` |
| Orders page (`/dashboard/customer/orders`) | `rental.action.ts` | `/api/rentals` | `GET` |
| Order detail page (`/dashboard/customer/orders/[id]`) | `rental.action.ts` | `/api/rentals/:id` | `GET` |
| `ReviewDialog` | `review.action.ts` | `/api/reviews` | `POST` |
| `PayView` (`/dashboard/customer/orders/[id]/pay`) | `payment.action.ts` | `/api/payments/create` | `POST` |
| `/payment/success` page | (inline `apiClient` call) | `/api/payments/confirm?session_id=:id` | `GET` |
| Payments history page (`/dashboard/customer/payments`) | `payment.action.ts` | `/api/payments` | `GET` |

---

## Provider

| Frontend Component | Action File | Endpoint | Method |
|---|---|---|---|
| `MyGearTable`, `GearManager` | `gear.action.ts` (provider) | `/api/gear/provider/my-gear` | `GET` |
| Add Gear page (`/dashboard/provider/gear/new`) | `gear.action.ts` (provider) | `/api/gear/provider` | `POST` |
| `GearManager` (view single) | `gear.action.ts` (provider) | `/api/gear/:id` (shared with public endpoint) | `GET` |
| `EditGearForm` | `gear.action.ts` (provider) | `/api/gear/provider/:id` | `PATCH` |
| `MyGearTable`, `GearManager` (delete) | `gear.action.ts` (provider) | `/api/gear/provider/:id` | `DELETE` |
| `OrderTable`, `stats.action.ts` | `order.action.ts` / `stats.action.ts` | `/api/rentals/provider/orders` | `GET` |
| `OrderTable` (status update) | `order.action.ts` | `/api/rentals/provider/:id` | `PATCH` |
| Provider Overview page (stats) | `stats.action.ts` | Derived client-side from `getMyGear()` + `/api/rentals/provider/orders` — no dedicated stats endpoint | — |

---

## Admin

| Frontend Component | Action File | Endpoint | Method |
|---|---|---|---|
| `UserTable` | `admin.action.ts` | `/api/admin/users` | `GET` |
| `UserTable` (suspend/activate) | `admin.action.ts` | `/api/admin/users/:id` | `PATCH` |
| `GearTable` (admin) | `admin.action.ts` | `/api/admin/gear` | `GET` |
| `RentalTable` (admin) | `admin.action.ts` | `/api/admin/rentals` | `GET` |
| Admin Overview stats (`stat-card.tsx`, `recent-activity.tsx`) | `admin.action.ts` | Derived client-side from the three endpoints above + `/api/categories` — no dedicated stats endpoint | — |
| `CategoryManager` | `category.action.ts` (admin) | `/api/categories` | `GET` |
| `CategoryManager` (create) | `category.action.ts` (admin) | `/api/categories` | `POST` |
| `CategoryManager` (edit) | `category.action.ts` (admin) | `/api/categories/:id` | `PATCH` |
| `CategoryManager` (delete) | `category.action.ts` (admin) | `/api/categories/:id` | `DELETE` |

---

## Notes

- `GET /api/gear/:id` is shared between the public gear details page and the provider's own gear view — same endpoint, same response shape.
- Admin and Provider "stats" overview cards are **not backed by a dedicated stats endpoint**; totals are computed client-side by fetching the underlying lists (users/gear/rentals for admin, gear/orders for provider) and reducing them. This keeps the backend simpler at the cost of slightly more data transferred than a purpose-built `/stats` endpoint would need.
