# GrowthTools Deployment Guide

Complete guide to taking GrowthTools from local → GitHub → Vercel → Production.

---

## 1. GitHub Setup

### Initialize Repository

```bash
cd growthtools

# Initialize git
git init

# Create .gitignore
cat > .gitignore << 'EOF'
.env
.env.local
.env.*.local
node_modules/
.next/
.DS_Store
*.log
prisma/migrations/dev/
EOF

# First commit
git add .
git commit -m "feat: initial GrowthTools scaffold"

# Push to GitHub
git remote add origin https://github.com/YOUR_ORG/growthtools.git
git branch -M main
git push -u origin main
```

### Branch Strategy

```
main          # Production-ready. Auto-deploys to growthtools.io
staging       # Pre-production. Deploys to staging.growthtools.io
dev           # Active development. PR preview URLs
feature/xxx   # Feature branches → PR → merge to dev
```

### Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add Meta safe zone checker
fix: correct UTM encoding for special characters
chore: update dependencies
refactor: extract URL validation to lib/utils
perf: lazy-load QR library
```

### GitHub Actions — CI

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx prisma generate
      - run: npm run lint
      - run: npx tsc --noEmit
```

---

## 2. PostgreSQL Setup

### Option A: Vercel Postgres (Recommended — zero config)

1. Open your Vercel project → **Storage** tab
2. Click **Create Database → Postgres**
3. Name it `growthtools-db`
4. Select same region as your Vercel deployment
5. Vercel auto-populates `DATABASE_URL` in your project env vars
6. Run: `npx prisma migrate deploy`

### Option B: Supabase (free tier, more control)

1. Create project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database → Connection string (URI)**
3. Copy the connection string
4. Set `DATABASE_URL` in Vercel env vars
5. Run: `npx prisma migrate deploy`

### Option C: Neon (serverless, generous free tier)

1. Create project at [neon.tech](https://neon.tech)
2. Copy the connection string from the dashboard
3. Append `?sslmode=require` if not already present
4. Set `DATABASE_URL` in Vercel env vars
5. Run migrations

### Running Migrations

```bash
# Development
npx prisma migrate dev --name init

# Production (run after each deploy)
npx prisma migrate deploy

# Inspect database
npx prisma studio
```

---

## 3. Vercel Deployment

### Import and Deploy

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository** → select `growthtools`
3. Framework preset: **Next.js** (auto-detected)
4. Set all environment variables (see below)
5. Click **Deploy**

### Environment Variables to Set in Vercel

Go to **Project Settings → Environment Variables** and add:

| Key | Value | Scope |
|-----|-------|-------|
| `DATABASE_URL` | Your PostgreSQL URL | Production, Preview, Development |
| `AUTH_SECRET` | `openssl rand -base64 32` output | All |
| `AUTH_URL` | `https://growthtools.io` | Production |
| `AUTH_GOOGLE_ID` | Google Client ID | All |
| `AUTH_GOOGLE_SECRET` | Google Client Secret | All |
| `NEXT_PUBLIC_APP_URL` | `https://growthtools.io` | Production |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Production |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog key | Production |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN | Production |

### Configure Vercel Cron (Analytics Cleanup)

The `vercel.json` already has this configured:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

This runs daily at 2am UTC and deletes analytics older than 14 days.

---

## 4. Domain Configuration

### Connect Custom Domain

1. Vercel Dashboard → **Domains** tab
2. Add `growthtools.io` and `www.growthtools.io`
3. Update your DNS records:

```
Type    Name    Value                   TTL
A       @       76.76.21.21             Auto
CNAME   www     cname.vercel-dns.com    Auto
```

4. SSL certificate is auto-provisioned by Vercel (Let's Encrypt)

### Set Up Subdomain for Staging

1. Add `staging.growthtools.io` to Vercel domains
2. Link it to your `staging` branch in Vercel settings

---

## 5. Google Analytics 4 + GTM Setup

### GA4

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create property → Web → enter `growthtools.io`
3. Copy **Measurement ID** (`G-XXXXXXXXXX`)
4. Add to Vercel: `NEXT_PUBLIC_GA_MEASUREMENT_ID`

Add to `src/app/layout.tsx`:

```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

// Inside <body>:
<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
```

### PostHog

1. Sign up at [posthog.com](https://posthog.com)
2. Create project → copy API key
3. Add to Vercel: `NEXT_PUBLIC_POSTHOG_KEY`

Add PostHog provider to layout:

```tsx
// src/components/shared/analytics-provider.tsx
"use client";
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // capture manually
    })
  }, [])
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
```

---

## 6. Sentry Error Monitoring

```bash
npm install @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard@latest -i nextjs
```

This auto-creates:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `next.config.ts` modifications

Set in Vercel: `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`

---

## 7. Rate Limiting

Add rate limiting to the `/api/shorten` route using Upstash Redis:

```bash
npm install @upstash/ratelimit @upstash/redis
```

```typescript
// In src/app/api/shorten/route.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests/minute per IP
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      { status: 429 }
    );
  }
  // ... rest of handler
}
```

Set in Vercel: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

---

## 8. Abuse Prevention

### URL Shortener

- Rate limit: 10 shortens/minute per IP (anonymous), 60/minute (authenticated)
- Block known malicious domains using a blocklist
- Add Content Security Policy headers (already in `next.config.ts`)

### Slug Validation

Custom slugs enforce: `^[a-z0-9-]{3,30}$` — no profanity filter yet (add `bad-words` npm package if needed).

### Bot Protection

Add Cloudflare Turnstile or hCaptcha to sign-up flows if spam becomes an issue.

---

## 9. Production Monitoring

### Vercel Analytics

Enable in Vercel Dashboard → Analytics tab. Gives Web Vitals, traffic, and LCP data.

### Alerting

Set up alerts in Sentry for:
- Error rate > 5% on `/api/shorten`
- P95 latency > 2s on `/api/[slug]` (redirect route)

### Log Drains

Route Vercel logs to Datadog, Logtail, or Axiom via Vercel Integrations.

---

## 10. Future Tool Roadmap

Add these as self-contained modules — each is a new page + component + optional API:

| Tool | Notes |
|------|-------|
| Meta Text Overlay Checker | Canvas-based, client-side |
| CPI / ROAS / LTV / CAC Calculator | Pure React, no DB needed |
| App Store Keyword Density | Needs ASO API integration |
| ASO Metadata Generator | OpenAI API for suggestions |
| GEO Landing Page Generator | Integration with translation APIs |
| Ad Copy Generator | OpenAI / Claude API |
| Creative Brief Generator | Form → AI output |
| Incrementality Calculator | Stats-heavy, pure client |
| Marketing Experiment Calculator | Stats: MDE, sample size, power |

Each tool follows the same pattern:
1. `src/app/(tools)/[tool-name]/page.tsx` — page with SEO metadata + FAQ schema
2. `src/components/tools/[tool-name]/` — component(s)
3. Add to `tools-grid.tsx` and `header.tsx`

---

## SSL & Security Checklist

- [x] SSL: Auto-provisioned by Vercel
- [x] Security headers: Set in `next.config.ts`
- [x] CSRF: NextAuth handles this via CSRF tokens
- [x] SQL injection: Prisma ORM uses parameterized queries
- [x] XSS: React escapes by default; no `dangerouslySetInnerHTML` in user content
- [ ] Rate limiting: Add Upstash Redis (see above)
- [ ] Abuse blocklist: Add known phishing domains to URL blocklist
- [ ] Content-Security-Policy: Tighten in production via `next.config.ts`
- [ ] Bot protection: Add Cloudflare Turnstile if needed

---

*Built with ❤️ for growth marketers.*
