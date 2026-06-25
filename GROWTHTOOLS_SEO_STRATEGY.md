# GrowthTools — SEO & Content Growth Strategy
**Prepared for:** aswin.growth@gmail.com  
**Date:** June 2026  
**Property:** https://growthtools.vercel.app/  
**Goal:** Traffic → Trust → Email Capture → Product Adoption

---

## PHASE 1: WEBSITE AUDIT

### Critical Pre-Audit Finding: Domain Is Broken

Every page has `og:url` pointing to `https://growthtools.io`, which doesn't resolve. This means every social share, crawler that follows canonical signals, and link attribution goes to a ghost URL. **Fix this before anything else.**

**Immediate fixes required before SEO work begins:**

1. Buy `growthtools.io` (or `.com`) and connect to Vercel
2. Update `NEXT_PUBLIC_APP_URL` env var to the real domain
3. Set 301 redirect from Vercel subdomain → custom domain
4. Twitter card title is generic on all tool pages (shows site name, not page name)
5. Footer links to `/about`, `/privacy`, `/terms` are 404s — crawl budget waste + trust signal failure
6. Screenshot Checker is missing from footer nav

---

### Page-by-Page Audit

| URL | Purpose | Search Intent | SEO Potential | Issues | Opportunities |
|-----|---------|--------------|--------------|--------|--------------|
| `/` | Homepage / tool directory | Navigational + Informational | Medium-High | No H2 keyword targets; hero copy doesn't target a search query; no email capture above the fold | Add email capture; add keyword-rich intro paragraph targeting "free marketing tools"; add trust signals (tool count, user count) |
| `/utm-builder` | UTM parameter builder | Transactional ("utm builder free") | **High** | SEO content section is thin (2 short paragraphs + table); App Campaign tab not mentioned in metadata; OG URL broken | Expand SEO section to 800+ words; add FAQ schema; add "Play Store UTM" as separate H2 to capture app campaign queries |
| `/match-type` | Keyword match type converter | Transactional + Informational | **Very High** | Not audited yet — likely same thin content pattern | Target "google ads keyword match types" (90K/mo); add comparison table; add examples |
| `/qr-generator` | QR code generator | Transactional | High — but very competitive | Competing against Canva, Adobe, QR code monkey | Differentiate on UTM-aware QR codes; target "qr code generator with utm tracking" niche |
| `/url-shortener` | Link shortener + analytics | Transactional | Medium | Competing with Bitly, Short.io; unclear tracking differentiator | Target "url shortener with click analytics"; emphasize 14-day analytics + city data as differentiator |
| `/screenshot-checker` | App screenshot dimension checker | Transactional + Informational | **Very High** | No SEO content below the tool; thin page; massive keyword gap in this niche | "App store screenshot dimensions" has almost no strong free tool competitors; this is the biggest SEO opportunity on the site right now |
| `/meta-safe-zone` | Coming soon | N/A | Low (blocked) | Coming soon page wastes crawl budget | Add at least a preview/description; pre-capture email for launch waitlist |
| `/app-store-preview` | Coming soon | N/A | Low (blocked) | Same as above | Pre-publish a landing page targeting "app store screenshot preview" |
| `/play-store-preview` | Coming soon | N/A | Low (blocked) | Same | Target "google play store screenshot preview tool" |
| `/dashboard` | User dashboard | Navigational | None (no-index it) | Should be excluded from sitemap and robots | Add `noindex` meta tag |

### Internal Linking Score: 3/10
- No cross-linking between tools ("Use the URL Shortener with your UTM links →")
- Footer missing Screenshot Checker
- No blog = zero internal link architecture
- No "related tools" section on any tool page

### Email Capture Score: 1/10
- Only mechanism is Google OAuth sign-up
- No dedicated email capture (newsletter, benchmark report, template download)
- No exit-intent or scroll-triggered capture

### Conversion Architecture Score: 4/10
- Login nudge exists in UTM Builder ✓
- No tool → tool cross-sell ("After building your UTM link, shorten it →")
- No social proof on tool pages
- No use case framing ("Used by 500+ ASO teams")

---

## PHASE 2: AUDIENCE MAPPING

### ICP 1: Performance Marketer (Paid Media)

**Profile:** Works at a brand or agency, runs Google Ads / Meta Ads, manages $10K–$500K/month spend.

| Dimension | Detail |
|-----------|--------|
| Goals | Accurate attribution, campaign governance, ROAS optimization |
| Pain points | UTM inconsistency across team, broken tracking, no naming convention standard |
| Search behavior | Googles specific tools ("utm builder") and how-tos ("how to track campaigns in ga4") |
| Top keywords | utm builder, campaign url builder, utm naming convention, ga4 campaign tracking |
| Communities | Reddit r/PPC, Twitter/X #ppcchat, LinkedIn marketing groups |
| Tools used | Google Ads, Meta Ads Manager, GA4, Looker Studio, Supermetrics |
| **Entry point to GrowthTools** | UTM Builder → save presets (email capture) |

### ICP 2: ASO Specialist / App Marketer

**Profile:** Manages App Store / Play Store listings for 1–10 apps. Obsessed with conversion rate, screenshots, keywords.

| Dimension | Detail |
|-----------|--------|
| Goals | Higher CVR on store listing, correct screenshots, keyword ranking |
| Pain points | Screenshot dimensions change every iPhone cycle; hard to verify before submission |
| Search behavior | Googles very specific queries: "iphone 16 pro max screenshot size", "app store screenshot requirements 2024" |
| Top keywords | app store screenshot dimensions, ios screenshot size, android screenshot requirements, aso screenshot best practices |
| Communities | Reddit r/ASO, MobileDevMemo newsletter, RevenueCat blog readers |
| Tools used | AppFollow, Sensor Tower, MobileAction, AppTweak |
| **Entry point to GrowthTools** | Screenshot Checker → this ICP has almost no free tool serving them |

### ICP 3: Growth Manager / Growth Hacker

**Profile:** Runs experiments, owns activation and retention metrics. Works at a Series A–C startup.

| Dimension | Detail |
|-----------|--------|
| Goals | Ship experiments faster, prove incrementality, track activation funnels |
| Pain points | No single source of truth for growth metrics; need calculators not spreadsheets |
| Search behavior | Framework-first: "pirate metrics", "aarrr framework", "growth experiment template" |
| Top keywords | growth experiment template, activation rate benchmark, retention benchmark saas, aarrr framework |
| Communities | Reforge network, Lenny's Newsletter readers, r/growth_hacking |
| Tools used | Mixpanel, Amplitude, Notion, Linear |
| **Entry point to GrowthTools** | Calculators (build these) → content → email |

### ICP 4: Startup Founder (0→1 stage)

**Profile:** Non-marketer founder doing their own growth. Has budget anxiety. Wants to do things right without paying agency rates.

| Dimension | Detail |
|-----------|--------|
| Goals | Launch campaigns correctly, track what works, avoid wasting budget |
| Pain points | Doesn't know UTM from URL; has no naming convention; can't justify paid tools |
| Search behavior | Broader, more educational: "how to track marketing campaigns", "utm parameters tutorial" |
| Top keywords | how to track marketing campaigns, utm parameters guide, google analytics campaign tracking, free marketing tools startups |
| Communities | Indie Hackers, Product Hunt, Y Combinator Startup School |
| Tools used | Webflow/Framer, GA4, Mailchimp, whatever's free |
| **Entry point to GrowthTools** | Educational content → tool → email |

### ICP 5: Marketing Agency / Freelancer

**Profile:** Manages campaigns for 5–50 clients. Needs tools that work without client logins. Speed is everything.

| Dimension | Detail |
|-----------|--------|
| Goals | Build UTMs fast, maintain client naming conventions, generate QR codes for print |
| Pain points | Different clients, different conventions; no shared tool that's free and fast |
| Search behavior | Comparison-focused: "best utm builder", "utm builder for agencies", "qr code generator business" |
| Top keywords | utm builder for agencies, bulk utm generator, qr code generator for business, custom qr code free |
| Communities | LinkedIn agency groups, Twitter freelancer communities |
| Tools used | HubSpot, ClickUp, Asana, Canva |
| **Entry point to GrowthTools** | UTM Builder (presets save time) → QR Generator → email to unlock preset saving |

### ICP 6: Product Marketer

**Profile:** Owns product launches, onboarding campaigns, in-app messaging. Sits between product and marketing.

| Dimension | Detail |
|-----------|--------|
| Goals | Track launch performance, measure feature adoption, instrument email campaigns |
| Pain points | Getting engineers to instrument tracking properly; maintaining UTM hygiene across launches |
| Search behavior | "product launch tracking", "utm parameters for email campaigns", "how to track feature adoption" |
| Top keywords | product launch tracking template, utm for email, campaign tracking spreadsheet |
| Communities | Lenny's Newsletter, Product Marketing Alliance, Sharebird |
| **Entry point to GrowthTools** | UTM Builder + downloadable templates → email |

---

## PHASE 3: KEYWORD INTELLIGENCE

*Volume estimates based on SEMrush/Ahrefs industry benchmarks. Difficulty: 1–100 scale.*

### Cluster A: UTM / Campaign Tracking

| Keyword | Intent | Funnel | Est. Volume | Difficulty | Opportunity | Page Type |
|---------|--------|--------|------------|------------|-------------|-----------|
| utm builder | Transactional | BOFU | 40,000/mo | 62 | Medium | Tool page + landing |
| utm parameters | Informational | TOFU | 33,000/mo | 55 | High | Pillar guide |
| campaign url builder | Transactional | BOFU | 8,100/mo | 48 | High | Tool landing page |
| utm generator free | Transactional | BOFU | 5,400/mo | 44 | High | Tool page |
| utm naming convention | Informational | MOFU | 3,600/mo | 35 | **Very High** | Template + guide |
| google analytics utm tracking | Informational | MOFU | 4,400/mo | 50 | High | Tutorial |
| utm parameters ga4 | Informational | MOFU | 2,900/mo | 42 | **Very High** | Guide |
| play store campaign url | Transactional | BOFU | 880/mo | 18 | **Highest** | Tool page (low comp.) |
| google play referrer url | Informational | MOFU | 720/mo | 15 | **Highest** | Guide + tool |
| utm builder for agencies | Transactional | BOFU | 390/mo | 22 | **Very High** | Landing page |
| utm template google sheets | Informational | MOFU | 2,400/mo | 30 | High | Template download |

### Cluster B: ASO / App Store

| Keyword | Intent | Funnel | Est. Volume | Difficulty | Opportunity | Page Type |
|---------|--------|--------|------------|------------|-------------|-----------|
| app store screenshot dimensions | Informational | MOFU | 6,600/mo | 28 | **Highest** | Guide + tool |
| ios screenshot size | Informational | TOFU | 4,400/mo | 25 | **Highest** | Tool + reference |
| app store screenshot requirements | Informational | MOFU | 3,600/mo | 30 | **Very High** | Guide |
| iphone 16 pro max screenshot size | Informational | BOFU | 1,600/mo | 12 | **Highest** | Reference page |
| android screenshot requirements | Informational | MOFU | 2,900/mo | 24 | **Very High** | Guide + tool |
| google play screenshot size | Informational | MOFU | 2,400/mo | 22 | **Very High** | Reference |
| aso screenshot best practices | Informational | MOFU | 1,300/mo | 32 | High | Guide |
| app store screenshot size 2024 | Informational | MOFU | 1,900/mo | 20 | **Highest** | Guide (evergreen) |
| how to make app store screenshots | Informational | TOFU | 2,100/mo | 35 | High | Tutorial |
| app preview video requirements | Informational | MOFU | 720/mo | 20 | High | Guide |

### Cluster C: Google Ads / Keyword Match Types

| Keyword | Intent | Funnel | Est. Volume | Difficulty | Opportunity | Page Type |
|---------|--------|--------|------------|------------|-------------|-----------|
| google ads keyword match types | Informational | TOFU | 90,500/mo | 68 | Medium (high vol.) | Pillar guide |
| broad match vs exact match | Informational | MOFU | 12,100/mo | 52 | High | Comparison |
| phrase match google ads | Informational | MOFU | 8,100/mo | 55 | Medium | Guide |
| keyword match type tool | Transactional | BOFU | 2,400/mo | 28 | **Very High** | Tool landing |
| negative keyword list google ads | Informational | MOFU | 6,600/mo | 48 | High | Template + guide |
| google ads keyword match types 2024 | Informational | MOFU | 4,400/mo | 40 | High | Updated guide |
| broad match modifier | Informational | MOFU | 3,600/mo | 45 | Medium | Guide |
| exact match vs phrase match | Informational | MOFU | 2,400/mo | 42 | High | Comparison |

### Cluster D: Performance Marketing Calculators (Gap = tools to build)

| Keyword | Intent | Funnel | Est. Volume | Difficulty | Opportunity | Page Type |
|---------|--------|--------|------------|------------|-------------|-----------|
| roas calculator | Transactional | BOFU | 22,200/mo | 45 | **Very High** | Calculator tool |
| cac calculator | Transactional | BOFU | 8,100/mo | 38 | **Very High** | Calculator tool |
| ltv calculator | Transactional | BOFU | 12,100/mo | 42 | High | Calculator tool |
| cpm calculator | Transactional | BOFU | 14,800/mo | 35 | **Very High** | Calculator tool |
| ctr benchmark | Informational | MOFU | 4,400/mo | 40 | High | Benchmark data |
| blended cac | Informational | MOFU | 2,900/mo | 28 | **Very High** | Guide + calculator |
| cpa calculator | Transactional | BOFU | 9,900/mo | 40 | High | Calculator |
| media mix modeling | Informational | TOFU | 5,400/mo | 55 | Medium | Pillar |

### Cluster E: QR Code

| Keyword | Intent | Funnel | Est. Volume | Difficulty | Opportunity | Page Type |
|---------|--------|--------|------------|------------|-------------|-----------|
| qr code generator | Transactional | BOFU | 368,000/mo | 82 | Low (too competitive) | Tool page |
| qr code generator free | Transactional | BOFU | 165,000/mo | 80 | Low | Tool page |
| qr code with logo | Transactional | BOFU | 22,200/mo | 55 | Medium | Tool feature page |
| custom qr code | Transactional | BOFU | 18,100/mo | 60 | Medium | Feature page |
| qr code for marketing | Informational | MOFU | 5,400/mo | 40 | **High** | Guide |
| utm qr code | Transactional | BOFU | 2,400/mo | 25 | **Highest** | Feature guide |
| dynamic qr code | Informational | MOFU | 9,900/mo | 50 | Medium | Guide |
| qr code generator with analytics | Transactional | BOFU | 1,600/mo | 30 | **Very High** | Tool landing |

### Cluster F: Growth / Analytics (Future content)

| Keyword | Intent | Funnel | Est. Volume | Difficulty | Opportunity | Page Type |
|---------|--------|--------|------------|------------|-------------|-----------|
| growth experiment template | Informational | MOFU | 2,400/mo | 30 | High | Template |
| activation rate benchmark | Informational | MOFU | 1,300/mo | 25 | **Very High** | Benchmark data |
| saas retention benchmarks | Informational | MOFU | 3,600/mo | 38 | **Very High** | Benchmark study |
| pirate metrics template | Informational | TOFU | 1,900/mo | 22 | High | Template |
| marketing attribution models | Informational | TOFU | 6,600/mo | 55 | Medium | Pillar |
| ga4 audit checklist | Informational | MOFU | 2,100/mo | 32 | **Very High** | Checklist |
| event tracking plan template | Informational | MOFU | 1,600/mo | 28 | High | Template |

---

## PHASE 4: CONTENT MOATS

Generic blog content gets outcompeted by Semrush, HubSpot, and Neil Patel in 60 days. These are the proprietary data assets that create defensible ranking positions.

### Moat 1: App Store Screenshot Benchmark Study

**What it is:** Annual study of screenshot design patterns across the top 200 free apps in each category. Track: screenshot count used, text overlay % , first screenshot conversion focus (feature vs. lifestyle vs. social proof), portrait vs. landscape split.

**Why it ranks:** There is NO published data on this. Sensor Tower and AppTweak have it locked behind $2,000/month paywalls. A free public study becomes the most-cited resource in ASO.

**How to collect:** Write a scraper that pulls App Store listing screenshots via iTunes API, manually tag a sample of 200 apps across 10 categories.

**Why competitors struggle:** Requires manual data collection + ASO domain expertise. HubSpot and Ahrefs don't care about this niche. AppTweak won't publish it for free.

**Defensibility score: 9/10**

---

### Moat 2: UTM Parameter Usage Study

**What it is:** Analyze the UTM parameters that arrive at GA4 properties via Measurement Protocol / public data. Publish: most common utm_sources, naming convention patterns, error rates (spaces in UTM params, inconsistent casing), percentage of paid traffic that's untagged.

**Why it ranks:** The only published "state of UTM tracking" data anywhere. Every analytics post will cite it.

**How to collect:** Survey GrowthTools users (tie to email capture). Aggregate anonymized data from users who connect GA4 (future feature).

**Defensibility score: 8/10**

---

### Moat 3: CPI Benchmark Database by Network

**What it is:** Crowdsourced Cost Per Install benchmarks for Google UAC, Meta, AppLovin, IronSource, TikTok, Moloco — by vertical (Gaming, Finance, E-commerce, Health, Utilities).

**Why it ranks:** AppsFlyer publishes this every 6 months but it's gated. No free, real-time database exists.

**How to collect:** Form on GrowthTools asking app marketers to submit their blended CPI. Verify with proof of spend (honor system + community flag system). Publish quarterly.

**Defensibility score: 9/10**

---

### Moat 4: Marketing Tool Pricing Transparency Database

**What it is:** Up-to-date pricing for 150+ marketing tools. Searchable by category, company size, features. Updated monthly.

**Why it ranks:** G2 and Capterra bury pricing. No site has clean, up-to-date pricing in one place. "Tool X pricing" searches have 5K–15K volume each.

**How to collect:** Manual research + community contributions. Auto-flag when pricing pages change (Firecrawl + GitHub Actions).

**Defensibility score: 7/10**

---

### Moat 5: Google Ads Keyword Match Type Migration Guide (With Real Account Data)

**What it is:** After Google killed BMM, performance data across 100+ accounts showing exact impact of match type changes on CPC, impression share, and conversion rate.

**Why it ranks:** Everyone writes about match types theoretically. Real account data is extraordinarily rare and highly cited.

**How to collect:** Run a survey campaign through r/PPC and agency Twitter. Collect anonymized performance data from willing contributors. Publish as an annual "State of Match Types" report.

**Defensibility score: 8/10**

---

## PHASE 5: TOOL-LED SEO

Each tool is a hub. Every hub needs a landing page, supporting guides, comparison pages, use case pages.

---

### Hub 1: UTM Builder

**Core landing page:** `/utm-builder` — target "utm builder" + "campaign url builder"  
Current SEO content: ~150 words. Needs 800 minimum.

**Supporting content:**
| Page | Target Keyword | Volume | Priority |
|------|---------------|--------|----------|
| `/guides/utm-parameters` | utm parameters guide | 33K/mo | P1 |
| `/guides/utm-naming-convention` | utm naming convention | 3.6K/mo | P1 |
| `/guides/ga4-campaign-tracking` | ga4 campaign tracking | 2.9K/mo | P1 |
| `/guides/utm-parameters-email` | utm parameters for email | 2.4K/mo | P2 |
| `/guides/play-store-referrer-url` | google play referrer url | 720/mo | P1 (low comp.) |
| `/guides/utm-builder-for-agencies` | utm builder for agencies | 390/mo | P2 |
| `/templates/utm-naming-convention` | utm template | 2.4K/mo | P1 |

**Comparison pages:**
- `/vs/google-campaign-url-builder` — "google campaign url builder alternative"
- `/vs/bitly-utm` — users shorten UTM links; cross-sell URL shortener

**Use case pages:**
- `/use-cases/utm-for-google-ads`
- `/use-cases/utm-for-meta-ads`
- `/use-cases/utm-for-email-campaigns`
- `/use-cases/utm-for-influencer-campaigns`

---

### Hub 2: Screenshot Dimension Checker

**Core landing page:** `/screenshot-checker` — target "app store screenshot dimensions"  
Current SEO content: Zero. The tool is there but no educational content below it.

**This is the #1 SEO priority on the site.** No strong free tool ranks for this. Apple updates screenshot requirements every iPhone cycle, making old pages stale — creating a permanent freshness opportunity.

**Supporting content:**
| Page | Target Keyword | Volume | Priority |
|------|---------------|--------|----------|
| `/guides/app-store-screenshot-requirements` | app store screenshot requirements | 3.6K/mo | P1 |
| `/guides/ios-screenshot-sizes` | ios screenshot size 2024 | 4.4K/mo | P1 |
| `/guides/android-screenshot-requirements` | android screenshot requirements | 2.9K/mo | P1 |
| `/guides/aso-screenshot-best-practices` | aso screenshot best practices | 1.3K/mo | P1 |
| `/guides/app-store-screenshot-design` | how to make app store screenshots | 2.1K/mo | P2 |
| `/guides/iphone-16-pro-max-screenshot-size` | iphone 16 pro max screenshot size | 1.6K/mo | P1 (low comp.) |

**Use case pages:**
- `/use-cases/screenshot-checker-for-aso`
- `/use-cases/screenshot-checker-for-developers`

**Comparison:**
- `/vs/appmockupgenerator` — users searching for alternatives

---

### Hub 3: Keyword Match Type Tool

**Core landing page:** `/match-type` — target "keyword match type tool"

**Supporting content:**
| Page | Target Keyword | Volume | Priority |
|------|---------------|--------|----------|
| `/guides/google-ads-keyword-match-types` | google ads keyword match types | 90.5K/mo | P1 (pillar) |
| `/guides/broad-match-vs-exact-match` | broad match vs exact match | 12.1K/mo | P1 |
| `/guides/phrase-match-google-ads` | phrase match google ads | 8.1K/mo | P2 |
| `/guides/negative-keyword-list` | negative keyword list | 6.6K/mo | P2 |
| `/templates/negative-keyword-list` | negative keyword list template | 2.4K/mo | P2 |

---

### Hub 4: QR Code Generator

**Core strategy:** Don't fight Canva on "qr code generator." Win on the intersection of QR + UTM tracking — a completely uncontested niche.

**Supporting content:**
| Page | Target Keyword | Volume | Priority |
|------|---------------|--------|----------|
| `/guides/utm-qr-code` | utm qr code | 2.4K/mo | P1 (unique angle) |
| `/guides/qr-code-marketing` | qr code for marketing | 5.4K/mo | P2 |
| `/guides/qr-code-with-logo` | qr code with logo | 22.2K/mo | P2 |
| `/guides/track-qr-code-scans` | how to track qr code scans | 3.6K/mo | P1 |
| `/guides/qr-code-for-print` | qr code for print materials | 1.9K/mo | P2 |

---

### Hub 5: URL Shortener

**Core strategy:** Niche differentiation. Bitly and Short.io own "url shortener." Win on "url shortener with utm tracking" and "url shortener with analytics."

**Supporting content:**
| Page | Target Keyword | Volume | Priority |
|------|---------------|--------|----------|
| `/guides/url-shortener-with-analytics` | url shortener with analytics | 1.6K/mo | P1 |
| `/guides/link-tracking` | link tracking | 8.1K/mo | P2 |
| `/vs/bitly` | bitly alternative free | 4.4K/mo | P2 |
| `/vs/rebrandly` | rebrandly alternative | 1.3K/mo | P3 |

---

## PHASE 6: TOPICAL AUTHORITY MAP

```
GROWTHTOOLS CONTENT GRAPH
│
├── CAMPAIGN TRACKING
│   ├── Pillar: The Complete UTM Parameters Guide
│   ├── Cluster: UTM for Google Ads / Meta / Email / WhatsApp / Influencers
│   ├── Cluster: GA4 Campaign Tracking Setup
│   ├── Cluster: App Campaign Tracking (Play Store Referrer)
│   ├── Templates: UTM naming convention template (Google Sheets)
│   ├── Tools: UTM Builder, URL Shortener, QR Generator
│   └── Benchmarks: State of UTM Tracking (annual report)
│
├── APP STORE OPTIMIZATION (ASO)
│   ├── Pillar: App Store Screenshot Requirements — The Complete Guide
│   ├── Cluster: iOS screenshot sizes by device (iPhone 16, 15, 14, iPad)
│   ├── Cluster: Android / Play Store screenshot requirements
│   ├── Cluster: ASO screenshot design best practices
│   ├── Cluster: App preview video requirements
│   ├── Templates: Screenshot design checklist
│   ├── Tools: Screenshot Dimension Checker, App Store Preview (soon), Play Store Preview (soon)
│   └── Benchmarks: App Store Screenshot Benchmark Study (annual)
│
├── GOOGLE ADS
│   ├── Pillar: Google Ads Keyword Match Types — The Definitive Guide
│   ├── Cluster: Broad vs. Phrase vs. Exact Match comparison
│   ├── Cluster: Negative keywords strategy + list templates
│   ├── Cluster: Smart bidding + match types interplay
│   ├── Templates: Negative keyword list templates by industry
│   ├── Tools: Keyword Match Type Tool
│   └── Benchmarks: State of Match Types (survey report)
│
├── PERFORMANCE MARKETING (Future tools needed)
│   ├── Pillar: Performance Marketing Metrics — The Practitioner's Guide
│   ├── Calculators: ROAS, CAC, LTV, CPM, CPA, Blended CAC
│   ├── Cluster: How to calculate ROAS / what is good ROAS
│   ├── Cluster: CAC by channel benchmarks
│   ├── Cluster: LTV:CAC ratio benchmarks
│   ├── Cluster: App install cost benchmarks (CPI by network)
│   ├── Templates: Media plan templates, campaign brief templates
│   └── Benchmarks: CPI Benchmark Database (crowdsourced)
│
└── ANALYTICS & ATTRIBUTION
    ├── Pillar: Marketing Attribution — Models, Tools, and Best Practices
    ├── Cluster: GA4 audit checklist
    ├── Cluster: First-touch vs. last-touch vs. data-driven attribution
    ├── Cluster: Event tracking plan template
    ├── Tools: (future: GA4 audit tool, attribution calculator)
    └── Benchmarks: UTM Tracking Study (annual)
```

---

## PHASE 7: CONTENT BRIEF ENGINE

Every piece of content goes through this brief before writing begins. No exceptions.

### Standard Brief Template

```
CONTENT BRIEF
=============
Target keyword: [primary keyword]
Secondary keywords: [3–5 related terms]
Search intent: [Informational / Transactional / Commercial]
SERP analysis: [What's ranking? Format? Avg. word count? Freshness?]
Funnel stage: TOFU / MOFU / BOFU

COMPETITOR WEAKNESSES:
- [Article 1]: Too short, no examples
- [Article 2]: Outdated (pre-2024)
- [Article 3]: No template/tool CTA

WHAT WE MUST DO BETTER:
□ Include device-specific screenshot size table (for ASO content)
□ Include downloadable template
□ Include real campaign examples
□ Include calculator or tool embed

CONTENT OUTLINE:
H1: [Keyword-rich headline]
H2: [Section 1]
H2: [Section 2]
  H3: [Subsection]
H2: [FAQs]

FAQs (target PAA boxes):
Q: ...
Q: ...
Q: ...

Internal links (mandatory):
→ Link to [relevant tool]
→ Link to [related guide]

CTA:
Primary: [Use the Tool Free →]
Secondary: [Download Template] / [Get Notified]

Schema: FAQ schema / HowTo schema / Tool schema
```

---

## PHASE 8: HUMAN-FIRST WRITING STANDARDS

These are the non-negotiables. Every article is reviewed against this before publishing.

**Mandatory elements per article:**

- At least one real calculation or worked example (not theoretical)
- At least one screenshot or diagram
- A skimmable comparison table where relevant
- A TL;DR or key takeaways box at the top
- No introduction longer than 3 sentences — get to the point
- No passive voice in definitions ("UTM parameters are used by..." → "You use UTM parameters to...")
- Author tone: experienced practitioner talking to a peer, not a textbook explaining to a student

**Red flags that trigger a rewrite:**
- Intro starts with "In today's digital landscape..."
- Any use of "delve", "leverage", "comprehensive"
- Numbered list that explains a concept without a single example
- Section that could have been written without domain expertise
- Word count padded with definitions that belong in a glossary, not a guide

---

## PHASE 9: AUTONOMOUS SEO SYSTEM

### Architecture

```
INPUT LAYER
┌─────────────────────────────────────────────────────┐
│  Google Search Console API (weekly GSC pull)        │
│  Ahrefs API / CSV exports (keyword gaps)            │
│  Reddit: r/PPC, r/ASO, r/SEO (question mining)     │
│  Product Hunt discussions (job-to-be-done signals)  │
│  Competitor blog RSS feeds (content gap alerts)     │
└─────────────────────────────────────────────────────┘
              ↓
PROCESSING LAYER (n8n / Trigger.dev)
┌─────────────────────────────────────────────────────┐
│  1. Keyword gap finder                               │
│     Input: GSC impressions + Ahrefs position data  │
│     Output: Keywords ranking 5–20 (quick wins)     │
│                                                     │
│  2. Reddit/Quora intent miner                       │
│     Input: Subreddit scrape via Firecrawl           │
│     Output: Recurring questions → brief drafts     │
│                                                     │
│  3. Competitor content alerter                      │
│     Input: RSS + Firecrawl on competitor URLs       │
│     Output: "Competitor published X — here's gap"  │
│                                                     │
│  4. Content brief generator                         │
│     Input: Target keyword + SERP via Tavily        │
│     Output: Structured brief (Phase 7 format)      │
└─────────────────────────────────────────────────────┘
              ↓
DRAFT LAYER (Claude API)
┌─────────────────────────────────────────────────────┐
│  Input: Approved content brief                       │
│  Model: Claude claude-sonnet-4-6 (quality) or Haiku (speed) │
│  Prompt: Human-first writing rules (Phase 8)        │
│  Output: Draft article in Markdown                  │
│  Stored in: Supabase + GitHub repo                  │
└─────────────────────────────────────────────────────┘
              ↓
REVIEW GATE — HUMAN APPROVAL REQUIRED
┌─────────────────────────────────────────────────────┐
│  Draft posted to private Notion/Linear review queue │
│  Aswin reviews + edits                              │
│  Approves → triggers publish pipeline               │
│  Rejects → sends back with notes → Claude revises  │
└─────────────────────────────────────────────────────┘
              ↓
PUBLISH LAYER
┌─────────────────────────────────────────────────────┐
│  GitHub Actions: Push MDX file to Next.js /guides   │
│  Vercel auto-deploys                                │
│  Sitemap auto-regenerates                           │
│  Internal links injected via link graph config     │
│  GSC re-index request via API                       │
└─────────────────────────────────────────────────────┘
              ↓
REFRESH LAYER (monthly)
┌─────────────────────────────────────────────────────┐
│  GSC: Flag articles with declining impressions      │
│  Auto-generate refresh brief: "Add 2024 data here" │
│  Claude proposes additions                          │
│  Human approves → re-publish with updated date     │
└─────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Orchestration | **n8n** (self-hosted) or **Trigger.dev** | Workflow automation |
| Web scraping | **Firecrawl** | Competitor content, Reddit mining |
| Search API | **Tavily** | SERP analysis for brief generation |
| AI drafting | **Claude API** (claude-sonnet-4-6) | Content drafting |
| Storage | **Supabase + Postgres** | Keyword DB, brief queue, content status |
| CMS | **MDX files in Next.js** | No headless CMS needed; Git-based |
| CI/CD | **GitHub Actions** | Auto-deploy on merge to main |
| Analytics | **Google Search Console API** | Position tracking, impression data |
| Review queue | **Linear** or **Notion** | Human approval workflow |

### Key Principle
**Nothing publishes without explicit human approval.** The system surfaces opportunities and drafts — humans decide what goes live. This prevents SEO spam and maintains quality.

---

## PHASE 10: PRIORITIZATION — TOP 25 PAGES TO BUILD

Ranked by ROI = (Traffic Potential × Conversion Potential) ÷ (Difficulty × Time to Rank)

| # | Page | Type | Traffic Potential | Conversion | Difficulty | Time to Rank | ROI Score |
|---|------|------|-------------------|-----------|------------|-------------|-----------|
| 1 | `/guides/app-store-screenshot-requirements` | Guide | High (6.6K+) | High (ASO tool → email) | **Low** (weak competition) | 2–4 months | ★★★★★ |
| 2 | `/guides/ios-screenshot-sizes` | Reference | High (4.4K+) | High | **Low** | 2–4 months | ★★★★★ |
| 3 | `/guides/utm-parameters` | Pillar | Very High (33K+) | Very High | Medium | 4–6 months | ★★★★★ |
| 4 | `/guides/play-store-referrer-url` | Guide | Medium (720/mo) | **Highest** (exact tool match) | **Lowest** (almost no competition) | 1–2 months | ★★★★★ |
| 5 | `/guides/utm-naming-convention` | Guide + Template | High (3.6K+) | High (template → email) | Low-Medium | 2–4 months | ★★★★☆ |
| 6 | `/guides/android-screenshot-requirements` | Reference | High (2.9K+) | High | Low | 2–3 months | ★★★★☆ |
| 7 | `/guides/utm-qr-code` | Guide | Medium (2.4K+) | Very High (2 tools) | **Lowest** | 1–2 months | ★★★★☆ |
| 8 | `/guides/google-ads-keyword-match-types` | Pillar | Very High (90K+) | Medium | High | 6–9 months | ★★★★☆ |
| 9 | `/guides/ga4-campaign-tracking` | Guide | High (2.9K+) | High | Medium | 3–5 months | ★★★★☆ |
| 10 | `/templates/utm-naming-convention` | Template | Medium (2.4K) | **Very High** (email gate) | Low | 2–3 months | ★★★★☆ |
| 11 | `/guides/track-qr-code-scans` | Guide | Medium (3.6K+) | High | Low-Medium | 2–4 months | ★★★★☆ |
| 12 | `/calculators/roas` | Tool | High (22K+) | High | Medium | 3–5 months | ★★★★☆ |
| 13 | `/guides/aso-screenshot-best-practices` | Guide | Medium (1.3K+) | High | Low | 2–3 months | ★★★★☆ |
| 14 | `/calculators/cac` | Tool | High (8.1K+) | High | Medium | 3–5 months | ★★★☆☆ |
| 15 | `/guides/broad-match-vs-exact-match` | Comparison | High (12.1K+) | Medium | Medium | 4–6 months | ★★★☆☆ |
| 16 | `/guides/url-shortener-with-analytics` | Guide | Medium (1.6K+) | High | Low | 2–3 months | ★★★☆☆ |
| 17 | `/guides/iphone-16-pro-max-screenshot-size` | Reference | Medium (1.6K+) | High | **Lowest** | 1 month | ★★★☆☆ |
| 18 | `/templates/negative-keyword-list` | Template | Medium (2.4K+) | High | Low | 2–3 months | ★★★☆☆ |
| 19 | `/calculators/cpm` | Tool | High (14.8K+) | Medium | Medium | 3–5 months | ★★★☆☆ |
| 20 | `/guides/qr-code-marketing` | Guide | High (5.4K+) | Medium | Medium | 4–6 months | ★★★☆☆ |
| 21 | `/vs/bitly` | Comparison | High (4.4K+) | High | Medium | 4–6 months | ★★★☆☆ |
| 22 | `/vs/google-campaign-url-builder` | Comparison | Medium (2.4K+) | High | Low | 2–4 months | ★★★☆☆ |
| 23 | `/guides/ga4-audit-checklist` | Checklist | Medium (2.1K+) | High | Medium | 3–5 months | ★★★☆☆ |
| 24 | `/benchmarks/cpi-by-network` | Data page | Medium | High | **Lowest** (unique data) | 2–3 months | ★★★☆☆ |
| 25 | `/guides/utm-for-email` | Guide | Medium (2.4K+) | High | Low | 2–3 months | ★★★☆☆ |

---

## IMMEDIATE ACTION LIST (Before Any Content)

These are pre-content, pre-SEO fixes that must happen in the next 7 days:

1. **Get a custom domain** — `growthtools.io` or `.com`. Every day on `.vercel.app` is a domain authority loss.
2. **Fix OG canonical URLs** — Update `NEXT_PUBLIC_APP_URL` to the custom domain.
3. **Build /about, /privacy, /terms** — Footer links are 404. Crawl budget and trust penalty.
4. **Add `/dashboard` to robots.txt disallow** — Don't waste crawl budget on auth-gated pages.
5. **Add email capture** — Even a simple "Get our UTM cheat sheet" with a Resend/Mailchimp integration. The entire funnel collapses without email.
6. **Add Twitter card per-page** — All tool pages inherit the generic site Twitter card. Fix `twitter:title` to be page-specific.
7. **Add footer link for Screenshot Checker** — It's live but not in the footer nav.
8. **Add SEO content below each tool** — UTM Builder has 150 words. It needs 800. Every other tool page has zero.

---

## 90-DAY SPRINT PLAN

### Month 1: Foundation
- Fix all immediate action items (domain, broken pages, meta tags)
- Set up email capture (even a basic form)
- Write and publish pages #1, #4, #7, #17 (lowest difficulty, fastest to rank)
- Add 500+ words of SEO content to each existing tool page
- Set up n8n + Supabase for content pipeline

### Month 2: Content Velocity
- Publish pages #2, #3, #5, #6, #8 from priority list
- Launch UTM naming convention template (email gate)
- Build ROAS calculator (#12) — highest-volume calculator
- Begin Reddit/ASO community distribution for Screenshot Checker content

### Month 3: Authority Building
- Publish the App Store Screenshot Benchmark Study (Moat #1)
- Launch CPI benchmark collection form (Moat #3)
- Build 3 comparison pages (#21, #22)
- Internal linking audit — ensure every guide links to the relevant tool
- Submit 10 guest posts to ASO/performance marketing newsletters

---

*This document is a living strategy. Review and update quarterly as GSC data accumulates.*
