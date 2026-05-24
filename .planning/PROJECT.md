# NeedFeed

## What This Is

NeedFeed is a web-based platform connecting individual donors with nursing homes and old age homes that need daily-use supplies (atta, dal, rice, oil, toiletries, medicines). Donors browse a live needs board, pledge specific items, and choose how to fulfil the pledge — via grocery delivery platforms, personal drop-off, or a managed payment option. Home admins manage their needs board and track incoming pledges through a separate dashboard.

## Core Value

A donor can see what a nursing home needs and pledge specific items in under 60 seconds.

## Requirements

### Validated

These capabilities exist in the current React + Vite prototype (mock data):

- ✓ Landing page with hero, platform stats, and CTAs — initial build
- ✓ Learn More page explaining the platform — initial build
- ✓ Get Started onboarding page — initial build
- ✓ Donor App: Home dashboard (greeting, platform stats, urgent needs, recent activity) — initial build
- ✓ Donor App: Browse Homes with search and filter pills — initial build
- ✓ Donor App: Home Profile with needs board table and Recent Donors — initial build
- ✓ Donor App: Pledge Flow — Step 1 (item + quantity), Step 2A (Order & Deliver), Step 2B (Drop off), Step 3 (confirmation) — initial build
- ✓ Donor App: My Pledges with Active/Completed tabs and Mark as Delivered — initial build
- ✓ Donor App: Impact page (stats, chart, top homes) — initial build
- ✓ Donor App: Profile page (account fields, notification toggles) — initial build
- ✓ Admin Dashboard: Dashboard overview (stats, urgent needs, today's deliveries, activity feed) — initial build
- ✓ Admin Dashboard: Needs Board with add/edit/remove modal and status auto-calculation — initial build
- ✓ Admin Dashboard: Incoming Pledges (Upcoming/Today/Overdue tabs, Mark as Received flow) — initial build
- ✓ Admin Dashboard: Donation History with search, date filter, export button — initial build
- ✓ Admin Dashboard: Home Profile edit form with shareable link and QR code — initial build
- ✓ Sidebar navigation with user chip and sign-out modal (both apps) — initial build
- ✓ Status badge system (Pledged, Delivered, Confirmed, Missed, Urgent, Partial, Covered) — initial build
- ✓ View toggle between Donor and Home Admin apps — initial build

### Active

This milestone: polish the prototype to personal-milestone quality before tackling the backend.

- [ ] UI visual quality — consistent spacing, color system, typography hierarchy, component polish across all screens
- [ ] Missing screens/flows — audit every BRD section against the codebase and build any gaps
- [ ] Mobile responsiveness — all screens work cleanly at 375px, 768px, and 1024px
- [ ] Interaction bugs — all buttons, modals, tabs, and state transitions work correctly end-to-end with mock data

### Out of Scope

- Supabase backend / real database — deferred; current milestone uses mock data only
- Authentication (Email + OTP) — deferred; no login required for prototype polish milestone
- Option C (Pay & handle it) fulfilment — BRD explicitly defers this to Phase 2 (Q4 2026); requires NGO supplier network
- WhatsApp / email notifications — deferred until real users and backend exist
- Razorpay / Cashfree payment integration — deferred with Option C
- Admin home registration / NGO verification flow — deferred until backend milestone
- Donor reliability score — listed as "future" in BRD
- Hindi language support — v2 per BRD

## Context

- **Tech stack:** React 18 + Vite, no backend, no external dependencies (aside from React DOM)
- **Data layer:** All data is static mock data in `src/data.js` — `HOMES`, `DONOR_PLEDGES`, `INCOMING_PLEDGES`, `HISTORY`, `RECENT_DONORS`
- **Two app modes:** Donor App (`src/DonorApp.jsx`) and Admin Dashboard (`src/AdminApp.jsx`), toggled via `ViewToggle` in `src/App.jsx`
- **Navigation:** Client-side page state (no router); `useState` drives active screen within each app
- **BRD:** `NeedFeed_BRD_v1_backup.docx` (also committed as `NeedFeed_BRD_latest.docx`) is the authoritative specification for all screens, fields, and business rules
- **Target geography:** Mumbai MVP (pin codes used for proximity, all prices in INR)
- **Prototype audience:** Personal milestone — clean and complete before adding backend

## Constraints

- **Tech stack:** React + Vite — already established; do not introduce a new framework
- **No backend this milestone:** All interactions must remain functional with mock data; no Supabase calls
- **BRD fidelity:** Screen layout, field names, status labels, and business rules must match the BRD spec exactly
- **Accessibility:** WCAG 2.1 AA for core flows (BRD non-functional requirement)
- **Performance:** Page load < 2 seconds on 4G (BRD non-functional requirement)
- **Browser support:** Chrome, Safari, Firefox (latest 2 versions)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React + Vite, no router | Fastest prototype iteration; single-page state navigation sufficient for mock data demo | — Pending |
| Mock data in data.js | Decouples UI polish from backend build; allows complete prototype without Supabase | — Pending |
| Skip auth for prototype | Authentication adds complexity without value until real data exists | — Pending |
| Option C deferred to v2 | Requires NGO supplier network and payment gateway — not available at launch | — Pending |
| NeedFeed_GSD branch | GSD-managed work isolated from main and tushar_v1; clean PR path | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-24 after initialization*
