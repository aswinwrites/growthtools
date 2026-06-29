# Google App Campaigns (UAC) — Best Practices Reference

*Last updated: 2026-06-29 | For future article writing, fact-checking, and content expansion*

---

## Key Expert Sources

| Source | Author | URL | Key contribution |
|--------|--------|-----|-----------------|
| Admiral Media | Kevin | admiral.media/google-app-campaigns-best-practices | Budget math, campaign structure, creative testing, NeuroNation/KaufDA case studies |
| Linkrunner | Lakshith Dinesh | linkrunner.io/blog/google-app-campaigns-(uac)-optimization-checklist | 15 levers framework, bid laddering, conversion priority weighting |
| Phiture | Various | phiture.com | Deep funnel event config, Firebase audience strategy |
| RocketShip HQ | Various | rocketshiphq.com | Install trap argument, quality vs volume debate |
| Google Ads Help | Google | support.google.com/google-ads/answer/6167162 | Official budget minimums (50×CPI, 10×CPA, 15×CPA for engagement) |
| Adapty | Various | adapty.io | Firebase → Google Ads audience sync |
| Udonis | Various | udonis.co | Creative best practices, UGC performance |

---

## Core Budget Rules (Cite These)

- **Install campaigns (ACi volume)**: Daily budget ≥ 50× target CPI
- **Action campaigns (tCPA)**: Daily budget ≥ 10× target CPA
- **Engagement campaigns (ACe)**: Daily budget ≥ 15× target CPA
- **Per Google's official documentation**: [support.google.com/google-ads/answer/6167162](https://support.google.com/google-ads/answer/6167162?hl=en)

---

## Bid Strategy Progression (The Core Framework)

```
Phase 1: Install volume
  → Trigger: <50 weekly conversions on target event
  → Goal: Build conversion signal
  → Risk: Attracts low-quality users if held too long

Phase 2: tCPA → in-app action
  → Trigger: 50+ weekly conversions on activation/engagement event
  → Target event examples: registration, tutorial_complete, d1_active
  → Bid = economic value of that event (not gut feel)

Phase 3: tCPA → first_purchase
  → Trigger: 50–74 weekly purchase conversions
  → Passes revenue value via MMP postback

Phase 4: tROAS
  → Trigger: 75+ weekly purchase conversions
  → Requires real revenue values in postbacks (not placeholders)
  → Optimises for high-LTV users, not just any converter
```

---

## Bid Cap Testing: The Ladder Method

Run 3 simultaneous campaigns:
- Conservative: 20% below tCPA goal / 20% of budget
- Target: at goal / 50% of budget  
- Aggressive: 30% above tCPA goal / 30% of budget

Evaluate after 14 days / 100+ conversions per variant. Measure D7 ROAS, not just CPI. Aggressive campaign often wins on LTV even when CPI is higher.

**Change rules**: Never adjust bids by more than 20% at a time. Wait 5–7 days between changes. Larger changes reset the learning phase.

---

## Creative Asset Specs & Priority

| Format | CPI impact | Slots available | Fill target |
|--------|-----------|----------------|-------------|
| HTML5 | −20 to −35% vs baseline | 20 | 5+ |
| Video (all orientations) | −15 to −25% vs baseline | 20 | 10+ (9:16, 16:9, 1:1) |
| Images | Baseline | 20 | 15+ (multiple ratios) |
| Text headlines | — | 10 | 8+ |

- **Creative rotation**: Rotate evenly for first 14 days of new asset; optimise after
- **Refresh cadence**: Replace bottom 20% every 14 days; full refresh every 21–30 days
- **Replace "Low" rated assets** within 7 days; never all at once (replace 2–3 at a time)
- **First 3 seconds of video** determine engagement — lead with value prop, not logo
- **UGC/creator-style content** consistently outperforms polished corporate creative

### Proven creative performance data
- KaufDA (Admiral Media case study): Creator-style vs standard → +731% user growth, +146% user activity, −18% CPI
- NeuroNation (Admiral Media case study): +117% ROAS, −39% CPI, +66% installs, +32% purchases, +42% net cohort revenue

---

## Deep Funnel Event Framework

### Event hierarchy by spend tier

| Spend/day | Optimisation target | Rationale |
|-----------|---------------------|-----------|
| <$500/day | Installs | Signal building only |
| $500–$2k/day | Activation (registration, tutorial_complete) | Differentiates intent |
| $2k–$5k/day | Monetisation (trial_start, first_purchase) | Revenue signal |
| $5k+/day | High-value (subscription_d30, high_value_purchase) | LTV optimisation |

### Event value calculation (pass to Google via MMP)

```
first_purchase value = actual transaction amount
trial_start value = subscription_price × trial-to-paid conversion rate
registration value = subscription_price × trial_rate × paid_rate
tutorial_complete value = subscription_price × full funnel conversion rate
```

### Technical requirements
- Postbacks must reach Google within 24 hours of event fire
- Use server-side postbacks where possible
- Verify in Firebase DebugView or MMP SDK console before launch
- Track 8–12 post-install events (not just install + registration)

---

## Firebase Audience Engineering

### Setup
Firebase Console → Project Settings → Integrations → Google Ads → Link

Audiences sync to Google Ads Audience Manager within 24 hours.

### High-value audiences to build

| Audience | Firebase condition | Use case |
|----------|-------------------|----------|
| Lapsed high-value | `last_open` >7d + `lifetime_value` >target threshold | ACe re-engagement at elevated bid |
| Trial non-converters | `trial_start` = true AND `subscription_start` = false | ACe trial-to-paid push |
| D1 active, D7 churned | `d1_active` = true AND `d7_active` = false | Re-engagement + UX fix |
| High-intent browsers | `product_view` ≥3 AND `add_to_cart` = false | Dynamic feature showcase |
| Seed: payers | `first_purchase` = true, LTV above threshold | ACi lookalike seed |
| Power users | `session_count` >30 in 30d | Exclude from ACi (already have app) |

### ACe campaign requirements
- Target must be Firebase audience (not Google Ads list)
- Separate from ACi campaigns — never mix goals
- Budget minimum: 15× tCPA (higher than ACi due to smaller pool)
- Creative: "what's new" or "you left something" messaging, not acquisition creative

---

## Campaign Structure Rules

1. **One country per campaign** — non-negotiable for markets with different CPI profiles
2. **One goal per campaign** — install, action, re-engagement never share campaigns
3. **3–5 campaigns max per market** at typical spend levels
4. **ACi and ACe always separate** — different signals, different users

### Structure template
```
Account
├── Country A
│   ├── ACi — Install volume (signal building only)
│   ├── ACi — tCPA: [activation event]
│   ├── ACi — tCPA: [purchase event]
│   └── ACe — Lapsed high-value (Firebase audience)
└── Country B (same structure)
```

---

## Learning Phase Facts

- Duration: 2–7 days OR 50 conversions on target event (whichever first)
- Triggers a reset: bid change >20%, budget change >20%, structural changes
- During learning phase: do not evaluate, do not adjust (adding creatives is OK)
- Signs you're stuck in learning: delivery erratic, CPA 3× target, impression share dropping

---

## The Install Trap (Key Argument for Articles)

**The argument**: Install-optimised campaigns train Google's algorithm on users who install and churn. On Android especially, install traffic is plagued with low-quality users and potentially bot traffic. Install CPI is a vanity metric — it measures the algorithm's ability to find anyone willing to tap a button.

**The nuance**: Install campaigns are NOT inherently wrong. They are wrong as a *permanent strategy*. Use them as signal-building mechanism only, then exit to tCPA as soon as you have 50+ weekly conversions on a meaningful event.

**The transition point**: 50+ weekly conversions on target event. Below this, tCPA campaigns have insufficient data to optimise — you will get erratic delivery and inflated CPAs. Above this, staying on install optimisation is wasteful.

---

## Measurement Principles

- **Source of truth**: Your MMP (AppsFlyer/Adjust/Singular/Firebase), not Google Ads
- **Google Ads attribution** always shows better numbers than reality (attribution windows, view-through)
- **Key metrics**: D7 ROAS, D30 LTV by cohort and campaign, CAC payback period, revenue per install
- **Attribution window default**: 30-day click / 1-day view — test 7-day click for impulse verticals
- **Cross-platform baseline**: If UAC delivers D7 ROAS 0.6× vs Meta 1.8× on comparable budgets/creative, that's signal to reallocate

---

## Article Published

- **URL**: https://www.marketertools.fyi/blog/google-uac-best-practices
- **Slug**: `google-uac-best-practices`
- **Published**: 2026-06-29
- **Category**: App Marketing
- **Tags**: Google App Campaigns, UAC, Mobile User Acquisition, tCPA, tROAS, Firebase, App Marketing, Bid Strategy, Creative Testing, Deep Funnel
- **Word count**: ~3,800 words
- **FAQ count**: 13

---

## Related Articles on MarketerTools

- [Marketing Attribution Models](/blog/marketing-attribution-models) — covers MMP vs platform attribution discrepancy
- [Campaign Naming Conventions](/blog/campaign-naming-conventions) — UAC campaign naming framework
- [UTM Parameters Guide](/blog/utm-parameters-complete-guide) — tagging UAC campaigns for GA4

---

## Future Article Ideas (UAC-Adjacent)

1. **Apple Search Ads vs Google UAC** — iOS-specific strategy, SKAN vs IDFA, bid strategies
2. **MMP Setup Guide** (AppsFlyer/Adjust/Singular) — postback configuration for accurate attribution
3. **App Store Optimisation for UA** — how ASO metadata affects UAC creative algorithm
4. **Performance Max vs App Campaigns** — when to use each, how they interact
5. **Mobile Measurement in the Post-ATT Era** — SKAN 4.0, modelled conversions, probabilistic matching
6. **TikTok Ads for App Growth** — comparing UAC vs TikTok App Events optimisation
