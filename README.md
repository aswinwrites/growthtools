# GrowthTools

**Free tools for growth marketers.** Built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion.

[growthtools.io](https://growthtools.io) · [Report an issue](https://github.com/yourorg/growthtools/issues)

---

## Features

| Tool | Status | Auth Required |
|------|--------|--------------|
| UTM Builder | ✅ Live | No (save presets needs auth) |
| Keyword Match Type Tool | ✅ Live | No |
| QR Code Generator | ✅ Live | No (save styles needs auth) |
| URL Shortener | ✅ Live | No (analytics needs auth) |
| Meta Safe Zone Checker | 🔜 Coming Soon | — |
| App Store Preview | 🔜 Coming Soon | — |
| Play Store Preview | 🔜 Coming Soon | — |

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: shadcn/ui + Radix UI
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **State**: Zustand (with persistence)
- **Auth**: NextAuth v5 (Auth.js) + Google OAuth
- **Database**: PostgreSQL + Prisma ORM
- **Toasts**: Sonner
- **QR Generation**: qrcode
- **Deployment**: Vercel

---

## Project Structure

```
growthtools/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (auth, toast, header, footer)
│   │   ├── page.tsx             # Landing page
│   │   ├── (tools)/             # Route group — no layout change
│   │   │   ├── utm-builder/
│   │   │   ├── match-type/
│   │   │   ├── qr-generator/
│   │   │   ├── url-shortener/
│   │   │   ├── meta-safe-zone/
│   │   │   ├── app-store-preview/
│   │   │   └── play-store-preview/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   │   ├── shorten/              # POST create, GET list
│   │   │   ├── analytics/            # GET 14-day analytics
│   │   │   ├── [slug]/               # Redirect handler
│   │   │   └── cron/cleanup/         # 14-day data cleanup
│   │   └── dashboard/               # Authenticated dashboard
│   ├── components/
│   │   ├── home/                # Landing page sections
│   │   ├── layout/              # Header, Footer
│   │   ├── shared/              # CopyButton, LoginPrompt, ToolCard, ComingSoon
│   │   └── tools/               # Per-tool components
│   ├── lib/
│   │   ├── auth.ts              # NextAuth config
│   │   ├── db.ts                # Prisma singleton
│   │   └── utils.ts             # UTM builder, formatters, helpers
│   ├── store/
│   │   └── index.ts             # Zustand stores (UTM, QR, UI, MatchType)
│   └── types/
│       └── index.ts             # Shared TypeScript types
├── prisma/
│   └── schema.prisma            # PostgreSQL schema
├── public/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── vercel.json
└── package.json
```

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/yourorg/growthtools.git
cd growthtools
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local` (see Environment Variables section below).

### 3. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to your PostgreSQL database
npm run db:push

# Or run migrations (recommended for production)
npm run db:migrate
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | Random secret for NextAuth (generate with `openssl rand -base64 32`) |
| `AUTH_URL` | ✅ | Your app's base URL |
| `AUTH_GOOGLE_ID` | ✅ | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | ✅ | Google OAuth Client Secret |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public URL of your app |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional | PostHog project API key |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Sentry DSN for error monitoring |
| `UPSTASH_REDIS_REST_URL` | Optional | For rate limiting (Upstash Redis) |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash auth token |

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable **Google+ API** and **Google Identity** API
4. Go to **Credentials → Create Credentials → OAuth 2.0 Client IDs**
5. Application type: **Web application**
6. Add Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local`

---

## Database Schema

### Tables
- `users` — NextAuth user accounts
- `accounts` — OAuth provider accounts
- `sessions` — Active sessions
- `verification_tokens` — Email verification
- `utm_presets` — Saved UTM configurations per user
- `qr_presets` — Saved QR style configurations per user
- `short_links` — Shortened URLs (anonymous + authenticated)
- `link_clicks` — Per-click analytics (auto-deleted after 14 days)

---

## API Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | — | NextAuth handler |
| `/api/shorten` | POST | Optional | Create short link |
| `/api/shorten` | GET | Required | List user's links |
| `/api/analytics` | GET | Required | 14-day link analytics |
| `/api/[slug]` | GET | — | Redirect + track click |
| `/api/cron/cleanup` | GET | — | Delete old analytics (Vercel cron) |

---

## Adding New Tools

GrowthTools is designed as a plug-and-play tool system. To add a new tool:

1. Create the page: `src/app/(tools)/your-tool/page.tsx`
2. Create the component: `src/components/tools/your-tool/your-tool.tsx`
3. Add to the tools grid in `src/components/home/tools-grid.tsx`
4. Add to the header nav in `src/components/layout/header.tsx`
5. Add Prisma models if the tool needs persistence
6. Add Zustand store slice if the tool needs state
7. Add API routes in `src/app/api/your-tool/`

---

## Production Checklist

### Before deploying
- [ ] All environment variables set in Vercel dashboard
- [ ] Database migrated: `npx prisma migrate deploy`
- [ ] Google OAuth redirect URIs updated to production domain
- [ ] `AUTH_SECRET` generated and set (not the dev one)
- [ ] `NEXT_PUBLIC_APP_URL` set to your production domain
- [ ] Vercel cron job configured in `vercel.json`

### After deploying
- [ ] Test Google sign-in flow end-to-end
- [ ] Test URL shortening and redirect
- [ ] Verify Vercel Analytics is tracking
- [ ] Set up Sentry for error monitoring
- [ ] Configure custom domain in Vercel
- [ ] Enable SSL (automatic on Vercel)
- [ ] Test Lighthouse score (target: 95+)
- [ ] Submit sitemap to Google Search Console

---

## Performance

- Server Components by default — minimal JS to client
- Dynamic imports for heavy libraries (QR, animations)
- `next/image` for all images
- Tailwind CSS purging for minimal CSS bundle
- Zustand with `persist` for client state (localStorage)
- Edge-compatible API routes where possible

---

## License

MIT — use freely, build on top, ship your own tools.
