# Phase 1: Complete Prototype Polish - Context

**Gathered:** 2026-05-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a clean, complete, fully interactive NeedFeed prototype with consistent UI, all BRD-specified screens and flows present, desktop responsiveness locked, and Swiggy cart integration wired into the Pledge Flow. No backend — all interactions remain mock-data-only.

</domain>

<decisions>
## Implementation Decisions

### Swiggy Integration
- **D-01:** Use direct Swiggy MCP tool call (not a deeplink) to add item + quantity + home delivery address to a Swiggy cart, then redirect donor to Swiggy checkout
- **D-02:** On failure (item not found, area not serviceable, MCP error) — show a clear error message inline with a retry button. No automatic fallback to other platforms.
- **D-03:** Integration point is `PledgeForm` (src/DonorApp.jsx:377) Step 2A — replace/augment the current "Order & Deliver" method card with Swiggy MCP call

### Empty States
- **D-04:** Empty states use icon + bold title + muted subtitle pattern (extend the existing `.empty` class in index.css)
- **D-05:** All empty states include a contextual CTA button — e.g., empty My Pledges → "Browse homes"; empty Needs Board → "Add first need"; empty Browse results → "Clear filters"

### Impact Card (Donor)
- **D-06:** Share mechanism is screenshot-hint only — style the card beautifully, show "Press & hold to save" hint. No Web Share API, no html2canvas library.
- **D-07:** Card shows: total pledges, homes supported, residents helped, streak, and the NeedFeed brand mark

### QR Code (Admin)
- **D-08:** Use a free QR API (e.g. `api.qrserver.com/v1/create-qr-code/?data={url}&size=160x160`) — returns a PNG, no npm library needed
- **D-09:** Display inline in the Home Profile edit page (not a modal) alongside the shareable link card

### Notification Preferences
- **D-10:** Toggles are session-state only — they work during the session but do not persist to localStorage or any store
- **D-11:** Three toggles exactly as BRD Section 3.7: "Email alerts", "WhatsApp updates", "Monthly impact summary"

### Claude's Discretion
- Visual design of empty state icons/illustrations — use NeedFeed brand colors (teal primary), simple SVG or emoji icons that match the platform's warm tone
- Exact layout of shareable impact card — should feel like a social share card, use `--serif` font for the stat numbers

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Spec
- `.planning/PROJECT.md` — project constraints, core value, out-of-scope boundaries
- `.planning/REQUIREMENTS.md` — all 13 v1 requirements with REQ-IDs (UI-01–04, FLOW-01–03, SWIGGY-01–02, DESK-01–02, BUG-01–02)
- `.planning/ROADMAP.md` — Phase 1 success criteria (6 criteria to verify against)

### BRD (source of truth for all screen specs)
- `NeedFeed_BRD_latest.docx` — authoritative specification for every page, field, interaction, and business rule. Key sections:
  - Section 3.1.2: Status badge colors (Pledged #0F6E56, Delivered #B8860B, Confirmed #3B6D11, Missed #D85A30)
  - Section 3.4: Pledge Flow step-by-step (Steps 1, 2A, 2B, 3)
  - Section 3.6: Impact page spec (stats, chart, shareable card)
  - Section 3.7: Profile page fields and notification toggles
  - Section 4.2: Admin Needs Board spec
  - Section 4.3: Incoming Pledges spec
  - Section 4.5: Admin Home Profile edit fields

### Codebase
- `src/DonorApp.jsx` — all Donor App screens; PledgeForm at line 377, DonorImpact at line 639, DonorProfile at line 728
- `src/AdminApp.jsx` — all Admin Dashboard screens; HomeProfileEdit at line 424
- `src/index.css` — full design token system (`:root` vars), `.empty` class at line 885, all component styles
- `src/data.js` — mock data structure (HOMES, DONOR_PLEDGES, INCOMING_PLEDGES, HISTORY, RECENT_DONORS)

### Swiggy MCP
- Swiggy MCP docs: `https://mcp.swiggy.com/builders/docs/start/consumer/use-in-ai-client/` — must be checked for available tools, auth requirements, and cart API shape before implementing SWIGGY-01

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `StatusBadge` / `ABadge` components — handle all status values; reuse for any new status displays
- `.btn` with `.teal`, `.outline`, `.ghost`, `.coral`, `.sm` variants — all CTA buttons should use these
- `.card` component with `.hover` variant — all card-style containers use this
- `.segGroup` / `.tab` — tab toggle pattern for Active/Completed, Upcoming/Today/Overdue
- `.badge` — color variants already defined for all pledge and urgency statuses
- `.empty` class (index.css:885) — extend with icon + title + subtitle sub-elements

### Established Patterns
- All state via `useState` — no Redux/Zustand; keep this
- Page navigation via `setActive(key)` prop drilling — new screens follow same pattern
- Styling via plain CSS classes — no Tailwind, no CSS modules; all styles go in index.css
- Mock data from `src/data.js` — all new interactions stay within this data layer

### Integration Points
- `PledgeForm` (DonorApp.jsx:377) — Swiggy MCP call goes inside Step 2A method card handler
- `DonorImpact` (DonorApp.jsx:639) — add shareable card section at bottom of this component
- `HomeProfileEdit` (AdminApp.jsx:424) — add QR code + shareable link below the form
- `DonorProfile` (DonorApp.jsx:728) — notification preference toggles already exist as a section; wire them to useState

</code_context>

<specifics>
## Specific Ideas

- Swiggy integration replaces Option C (Pay & handle) — it IS the high-convenience fulfilment option for this prototype
- QR code uses `api.qrserver.com` GET request: `https://api.qrserver.com/v1/create-qr-code/?data=ENCODED_URL&size=160x160` — renders as `<img>` tag, zero dependencies
- Impact card must feel screenshot-worthy — use `--serif` font for big numbers, brand teal for accents, white card on a teal gradient background

</specifics>

<deferred>
## Deferred Ideas

- Mobile responsive layout (375px, 768px) — explicitly out of scope for this milestone; v2
- Supabase backend / real data persistence — deferred until prototype polish is complete
- Authentication (Email + OTP) — deferred; no login for this milestone
- Option C (Pay & handle it) — replaced by Swiggy; no longer needed

</deferred>

---

*Phase: 1-Complete Prototype Polish*
*Context gathered: 2026-05-24*
