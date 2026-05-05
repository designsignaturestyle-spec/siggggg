# Signature Style Interiors — PRD

## Original Problem Statement
Build the marketing website for **Signature Style Interiors** (Bangalore-based interior design studio offering affordable to premium turnkey solutions). Sections required: Hero, About, Services (8), Portfolio with category filter (Budget / Mid-Range / Premium), Why Choose Us, Pricing (3 tiers), Testimonials, Contact form (Name, Phone, Project Type, Budget Range, Message), floating WhatsApp button, Footer.

Brand contact: Phone & WhatsApp `8748055124`, Bangalore, Karnataka.

## User Choices
- Theme: **Italian Ivory** base with **gold + gray + white** accents (editorial luxury feel).
- Defaults applied (user did not specify): leads stored in MongoDB; stock interior images; placeholder social links.

## User Personas
- **Homeowner (primary)** — searching for a Bangalore interior designer who can deliver on-budget, on-time turnkey work.
- **Office / Commercial buyer** — wants a small workspace fit-out, values transparency.

## Architecture
- **Backend:** FastAPI + Motor (MongoDB). Single resource: `Lead`.
  - `GET /api/` → health
  - `POST /api/leads` → create lead (validates name, phone, project_type, budget_range; optional message)
  - `GET /api/leads` → list leads (admin-style, no auth yet)
- **Frontend:** React 19 + Tailwind + shadcn primitives (`sonner` for toasts). Single landing route `/`.
  - Components: `Header`, `Hero`, `About`, `Services`, `Portfolio`, `WhyChooseUs`, `Pricing`, `Testimonials`, `Contact`, `Footer`, `FloatingWhatsApp`.
  - Typography: Cormorant Garamond (display) + Outfit (body).
  - Palette: `#FAF6EC` ivory · `#C5A059` gold · `#2D2D2D` charcoal · `#FFFFFF` · `#6B6B6B` gray.

## What's Been Implemented (2025-12)
- Full single-page marketing site with 10 sections + floating WhatsApp.
- Lead capture form posting to `POST /api/leads`, with toast feedback.
- WhatsApp click-to-chat (pre-filled message) + tel: links.
- Portfolio category filter (All / Budget / Mid-Range / Premium).
- Fully responsive layout, smooth scroll, scroll-reveal animations.
- Backend tested (12/12 pytest cases passed via ingress).

## Backlog
### P0 (next priorities)
- Lightweight admin panel (auth-protected) to view/export leads.
- Replace placeholder social URLs with real Instagram / Facebook links.

### P1
- Email/WhatsApp lead notifications (Resend or SendGrid + Twilio/WhatsApp Business).
- Real project photos uploaded by client (replace stock).
- SEO: Open Graph, JSON-LD `LocalBusiness` schema, sitemap.xml.
- Rate limit + simple captcha on `POST /api/leads` to prevent spam.

### P2
- Blog/insights section for SEO.
- Multi-language (Kannada / Hindi).
- Before/after image slider in portfolio.
- Lead status workflow (new → contacted → quoted → won/lost).

## Mocked / Deferred
- Email & SMS notifications: NOT implemented (form only persists to MongoDB).
- Social media links: placeholder `#` (waiting on real URLs).

## Test Credentials
N/A — no auth on public endpoints. Admin panel will require credentials when added.
