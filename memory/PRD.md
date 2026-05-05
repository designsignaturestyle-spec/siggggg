# Signature Style Interiors — PRD

## Original Problem Statement
Marketing website for **Signature Style Interiors** (Bangalore interior design studio, affordable → premium turnkey). Sections: Hero, About, 8 Services, filterable Portfolio, Why Choose Us, 3-tier Pricing, Testimonials, Contact form, floating WhatsApp, Footer. Brand: phone & WhatsApp `8748055124`, email `designsignaturestyle@gmail.com`, Instagram `signaturestyleinteriors01`, Bangalore, Karnataka.

## User Choices
- Theme: **Italian Ivory** base with **gold + gray + white** accents (editorial luxury).
- Leads stored in MongoDB (no email/SMS on submission).
- Admin dashboard + WhatsApp one-click reply (no Twilio).

## User Personas
- **Homeowner** — wants Bangalore designer, compares budgets, reads testimonials.
- **Business owner** — small workspace fit-out inquiry.
- **Studio owner (admin)** — reviews and replies to leads from `/admin` dashboard.

## Architecture
### Backend (FastAPI + Motor + MongoDB)
- **Public:** `GET /api/` · `POST /api/leads` (contact form)
- **Auth:** `POST /api/admin/login` (bcrypt + JWT HS256, 24h expiry, 5-attempt lockout for 15min)
- **Admin (bearer-protected):** `GET /api/admin/me` · `GET /api/admin/leads` · `PATCH /api/admin/leads/{id}/status` · `GET /api/admin/stats`
- Admin seeded idempotently on startup from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- Indexes: `admins.email` unique, `leads.id` unique, `leads.created_at` desc, `login_attempts.identifier` unique.

### Frontend (React 19 + Tailwind + shadcn + sonner)
- Routes: `/` (Landing) · `/admin/login` · `/admin` (ProtectedRoute).
- `AuthContext` stores JWT in localStorage (`ssi_admin_token`), attaches `Authorization: Bearer` header.
- Typography: Cormorant Garamond + Outfit. Palette: `#FAF6EC` ivory · `#C5A059` gold · `#2D2D2D` charcoal · `#6B6B6B` gray · `#FFFFFF`.

## What's Been Implemented (2025-12)
- Full single-page marketing site with 10 sections + floating WhatsApp.
- Public lead capture (POST /api/leads) with toast feedback.
- **Admin auth:** JWT login, bcrypt hashing, 5-attempt brute-force lockout.
- **Admin dashboard (/admin):** stats cards (total / new / contacted / this week), searchable + filterable leads table, mobile card view, mark-as-contacted toggle, one-click WhatsApp reply with pre-filled message.
- Real contact info wired (phone, WhatsApp, email, Instagram).
- Deployment health check: PASS. Backend 17/17 + frontend 10/10 tests passed.

## Backlog
### P0
- Production: tighten CORS to frontend origin (currently `*`).

### P1
- Email / WhatsApp push notifications when a lead arrives (Resend + Twilio WhatsApp) — requires API keys.
- Replace stock portfolio photos with real project images.
- Pagination on `GET /api/admin/leads` (currently hard-capped at 1000).

### P2
- SEO: OpenGraph, JSON-LD `LocalBusiness`, sitemap, robots.
- Captcha / rate limit on `POST /api/leads` (spam defense).
- Multi-language (Kannada / Hindi).
- Before/after slider in portfolio.
- Admin analytics (leads-per-week chart, conversion by project type).
- Password reset flow (currently single-admin, password only changes via .env).

## Mocked / Deferred
- Email & SMS notifications: not implemented.
- Facebook integration: explicitly removed per user request.

## Test Credentials
See `/app/memory/test_credentials.md` — admin `designsignaturestyle@gmail.com` / `7337790789@signature`.
