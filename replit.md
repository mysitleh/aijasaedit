# AI Jasa Edit

A Next.js 14 landing page for an AI photo/video editing service.

## Stack
- **Framework**: Next.js 14.2.29 (migrated from 15 due to SWC native binary crash on AMD EPYC)
- **Config**: `next.config.mjs` (Next.js 14 requires .js/.mjs, not .ts)
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase Firestore (services & orders)
- **AI**: Google Genkit + Gemini 2.0 Flash
- **Package manager**: npm

## Dev Server
- Port: **5000**, host: `0.0.0.0`
- Run: `npm run dev`

## Required Secrets
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `GEMINI_API_KEY`

## Admin Authentication
- Login page: `/admin-login` (no sidebar, clean standalone page)
- Protected area: `/admin` and all sub-routes (guarded by middleware)
- Method: Password + HMAC-SHA256 session cookie (httpOnly, secure)
- Middleware uses Web Crypto API (Edge Runtime compatible)
- Secrets required: `ADMIN_PASSWORD`, `ADMIN_SECRET_KEY`

## Project Structure
```
src/
  middleware.ts       - Edge middleware protecting /admin routes
  app/
    page.tsx          - Main landing page
    layout.tsx        - Root layout
    actions.ts        - Server actions (getServices, createOrderAction)
    globals.css       - Global styles & CSS variables
    admin-login/      - Standalone login page (no sidebar layout)
    admin/            - Admin panel (protected by middleware)
      auth-actions.ts - loginAction, logoutAction, isAuthenticated
    blog/             - Blog listing page (/blog)
      [slug]/         - Blog post detail page (/blog/[slug])
  components/
    landing/
      header.tsx      - Sticky nav with mobile sheet menu
      hero.tsx        - Hero section
      style-gallery.tsx - AI style cards gallery (28 styles in 2 rows)
      services.tsx    - Service cards grid
      how-it-works.tsx
      showcase.tsx    - Before/after carousel
      order-form.tsx  - 4-step order form (Layanan → Data Diri → Detail → Bayar)
      footer.tsx
    ui/               - shadcn/ui components
  data/
    site-config.ts    - Payment info, WhatsApp number, service list (edit these to customize)
    blog-posts.json   - Blog post data (persistent, 4 articles)
  lib/
    firebase.ts       - Firebase config (gracefully disabled if secrets missing)
    blog.ts           - Blog utilities
    blog-storage.ts   - Blog CRUD (read/write JSON)
public/
  style-gallery-1.png - Style gallery preview image
  style-gallery-2.png - Style gallery preview image
  style-gallery-3.png - Style gallery preview image
```

## Order Flow (Payment-First)
1. **Step 1 — Layanan**: Customer picks a service (cards with thumbnail + price)
2. **Step 2 — Data Diri**: Name + WhatsApp (required), Email (optional)
3. **Step 3 — Detail**: Upload foto/video (max 15MB) + description
4. **Step 4 — Bayar**: Shows bank transfer info + QRIS; "Konfirmasi via WhatsApp" button opens WA with pre-filled order summary. Customer attaches payment proof + their file in WhatsApp.
- Payment info & WA number configured in `src/data/site-config.ts`
- Works 100% without Firebase — no backend required for the order flow

## Notes
- SWC binary crashes on AMD EPYC with Next.js 15. Downgraded to Next.js 14.
- Firebase gracefully falls back to empty arrays if env vars are not set.
- Style gallery has 28 styles: 14 per row, horizontally scrollable.
- QRIS image: `/public/qris-payment.png` (replace with your real QRIS code)
- Payment info: edit `src/data/site-config.ts` to set your real bank account and WA number
