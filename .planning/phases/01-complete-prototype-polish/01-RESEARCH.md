# Phase 1: Complete Prototype Polish - Research

**Researched:** 2026-05-24
**Domain:** React 18 + Vite prototype UI polish, Swiggy Instamart MCP API, desktop CSS layout, empty states, interactive feedback
**Confidence:** HIGH (UI/React domain), MEDIUM (Swiggy MCP integration — auth flow verified, full end-to-end checkout has known limitations)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Swiggy Integration**
- D-01: Use direct Swiggy MCP tool call (not a deeplink) to add item + quantity + home delivery address to a Swiggy cart, then redirect donor to Swiggy checkout
- D-02: On failure (item not found, area not serviceable, MCP error) — show a clear error message inline with a retry button. No automatic fallback to other platforms.
- D-03: Integration point is `PledgeForm` (src/DonorApp.jsx:377) Step 2A — replace/augment the current "Order & Deliver" method card with Swiggy MCP call

**Empty States**
- D-04: Empty states use icon + bold title + muted subtitle pattern (extend the existing `.empty` class in index.css)
- D-05: All empty states include a contextual CTA button — e.g., empty My Pledges → "Browse homes"; empty Needs Board → "Add first need"; empty Browse results → "Clear filters"

**Impact Card (Donor)**
- D-06: Share mechanism is screenshot-hint only — style the card beautifully, show "Press & hold to save" hint. No Web Share API, no html2canvas library.
- D-07: Card shows: total pledges, homes supported, residents helped, streak, and the NeedFeed brand mark

**QR Code (Admin)**
- D-08: Use a free QR API (`api.qrserver.com/v1/create-qr-code/?data={url}&size=160x160`) — returns a PNG, no npm library needed
- D-09: Display inline in the Home Profile edit page (not a modal) alongside the shareable link card

**Notification Preferences**
- D-10: Toggles are session-state only — they work during the session but do not persist to localStorage or any store
- D-11: Three toggles exactly as BRD Section 3.7: "Email alerts", "WhatsApp updates", "Monthly impact summary"

### Claude's Discretion
- Visual design of empty state icons/illustrations — use NeedFeed brand colors (teal primary), simple SVG or emoji icons that match the platform's warm tone
- Exact layout of shareable impact card — should feel like a social share card, use `--serif` font for the stat numbers

### Deferred Ideas (OUT OF SCOPE)
- Mobile responsive layout (375px, 768px) — explicitly out of scope for this milestone; v2
- Supabase backend / real data persistence — deferred until prototype polish is complete
- Authentication (Email + OTP) — deferred; no login for this milestone
- Option C (Pay & handle it) — replaced by Swiggy; no longer needed

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| UI-01 | All screens use consistent spacing scale, color token system, and typography hierarchy (no one-off values) | Token system fully documented in `:root` — audit/fix one-off inline styles |
| UI-02 | All cards, badges, buttons, and modals match BRD visual spec exactly (BRD Sections 3.1.2 and 4) | Badge color map in `StatusBadge`/`ABadge` verified against BRD hex values |
| UI-03 | Every list/table view that can be empty has a purposeful empty state | Current `.empty` class is plain text only — extend with icon/title/subtitle/CTA pattern |
| UI-04 | All interactive elements have hover/focus/active feedback; async state changes show visual confirmation | `.btn` hover/active defined; toggle wiring, mark-received visual feedback need audit |
| FLOW-01 | Donor can view a shareable impact card on the Impact page | Add screenshottable card below existing stats in `DonorImpact` |
| FLOW-02 | Admin can view and copy their home's auto-generated QR code on the Home Profile edit page | Add `<img>` tag pointing to `api.qrserver.com` in `HomeProfileEdit`, alongside copy button |
| FLOW-03 | Donor notification preference toggles on the Profile page save and restore state correctly within the session | `DonorProfile` currently renders toggles as static JSX — wire each to `useState` |
| SWIGGY-01 | In Pledge Flow Step 2A, donor can add pledged item directly to Swiggy cart via Swiggy MCP API | Replace "Open cart & order" button in `PledgeForm` step `order` with MCP call sequence |
| SWIGGY-02 | After Swiggy cart is populated, donor is redirected to Swiggy; on return can mark pledge as "Ordered" | `checkout` tool returns order data in-situ; redirect to `https://swiggy.com` + add "Mark as Ordered" state in PledgeForm success |
| DESK-01 | All Donor App screens render correctly and are fully usable at 1024px and wider | Audit `.urgentRow` (3-col grid), `.homeGrid` (2-col grid), `.twoCol` at 1024px — most should hold |
| DESK-02 | All Admin Dashboard screens render correctly and are fully usable at 1024px and wider | Same audit for admin `.topbar`, `.attnRow`, and table overflow at 1024px |
| BUG-01 | Full interaction audit of Donor App — all navigation, buttons, modals, pledge flow steps, tab toggles, and status transitions work correctly | Code read reveals: toggles unwired, NeedsBoard "Edit" button no-op, pledge success lacks "Ordered" state |
| BUG-02 | Full interaction audit of Admin Dashboard — all navigation, needs board CRUD, incoming pledge flows, mark-as-received, and history filtering work correctly | Code read reveals: DonationHistory search/filter/export no-op, NeedsBoard edit button no-op |

</phase_requirements>

---

## Summary

NeedFeed is a React 18 + Vite prototype with no external dependencies beyond React DOM. The codebase is highly organized — a full design token system in `index.css`, consistent component patterns (`.card`, `.btn`, `.badge`, `.empty`), and clean `useState`-driven navigation with prop drilling. The prototype is substantially built: all major screens exist, the pledge flow has 4 steps, and the Admin Dashboard has 5 sections. Phase 1 is a polish pass, not a rebuild.

The three structural additions are: (1) Swiggy MCP integration in `PledgeForm` Step 2A, (2) an impact card section in `DonorImpact`, and (3) a QR code block in `HomeProfileEdit`. The bulk of work is wiring existing UI (notification toggles, edit buttons, export, search) and extending the `.empty` class with the icon/title/subtitle/CTA pattern across all list views.

Swiggy MCP integration is the most complex work. The `swiggy-instamart` MCP server at `https://mcp.swiggy.com/im` exposes `search_products`, `update_cart`, and `checkout` tools. The flow requires: (1) get saved addresses, (2) search for the item by name, (3) call `update_cart` with the found `spinId` + quantity + `selectedAddressId`, (4) call `checkout`. A critical constraint: the `checkout` tool does NOT return a redirect URL — it completes the order in-situ. The BRD decision (D-01) to "redirect donor to Swiggy checkout" must be interpreted as a navigation to `https://swiggy.com` (or `https://www.swiggy.com/instamart`) after a successful checkout call, OR the UX can present a "View on Swiggy" link from the order response. Additionally, the Swiggy MCP API requires OAuth 2.1 (phone + OTP), which is a user-facing auth step the prototype must handle or proxy.

**Primary recommendation:** For the Swiggy MCP integration in a mock-data prototype, implement the full MCP call sequence as a best-effort async function — show the Swiggy auth prompt if needed, call `search_products` → `update_cart` → `checkout`, and display the order confirmation with a "View on Swiggy" link. On any error, show the inline error + retry per D-02. The auth requirement means this is an AI-client integration pattern (the MCP client must be connected), not a simple REST call from the browser.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| UI polish (spacing, tokens, typography) | Browser / Client | — | Pure CSS token audit and application |
| Empty states with CTAs | Browser / Client | — | Conditional rendering in React components |
| Interactive feedback (hover, focus, active) | Browser / Client | — | CSS pseudo-classes + React `useState` |
| Notification toggles (session state) | Browser / Client | — | `useState` per toggle; no backend |
| Impact card (shareable visual) | Browser / Client | — | Pure CSS layout + screenshot-hint UX |
| QR code (Admin) | Browser / Client | CDN / Static | `<img>` tag fetching PNG from `api.qrserver.com` |
| Swiggy MCP cart call | API / Backend (External) | Browser / Client | MCP JSON-RPC call to `mcp.swiggy.com/im` with OAuth session |
| Swiggy redirect post-checkout | Browser / Client | — | `window.open()` or anchor to Swiggy URL after checkout |
| Desktop responsiveness (1024px) | Browser / Client | — | CSS media queries / grid audit at 1024px breakpoint |
| Bug fixes (nav, modals, status transitions) | Browser / Client | — | React `useState` wiring in existing components |

---

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | ^18.3.1 | UI rendering | Already in project |
| react-dom | ^18.3.1 | DOM rendering | Already in project |
| vite | ^5.4.2 | Dev server / build | Already in project |

No new npm packages are introduced in this phase. All features are achievable with:
- Plain React `useState` and conditional rendering
- Plain CSS additions to `index.css`
- External HTTP APIs accessed via `<img>` tags (QR) or `fetch` (Swiggy MCP) — not npm packages

### External APIs (no install required)
| API | Access Pattern | Auth Required | URL |
|-----|----------------|---------------|-----|
| `api.qrserver.com` | `<img src="...">` GET | None | `https://api.qrserver.com/v1/create-qr-code/?data={url}&size=160x160` |
| Swiggy Instamart MCP | `fetch` POST JSON-RPC | OAuth 2.1 (phone+OTP) | `https://mcp.swiggy.com/im` |

**QR API verified:** `curl api.qrserver.com/v1/create-qr-code/?data=test&size=160x160` returned HTTP 200. [VERIFIED: live endpoint test]

**Installation:** No new packages needed.

---

## Package Legitimacy Audit

No new npm packages are introduced in this phase. N/A.

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

---

## Architecture Patterns

### System Architecture Diagram

```
Browser (React SPA)
       |
       +-- index.css (design tokens: :root vars, .btn, .badge, .card, .empty)
       |
       +-- App.jsx (ViewToggle: donor | admin)
              |
              +-- DonorApp.jsx  (useState: active screen, pledgeCtx, selectedHome)
              |      |
              |      +-- DonorHome → DonorBrowse → DonorHomeProfile
              |      |                                     |
              |      |                              openPledge(ctx)
              |      |                                     |
              |      +-- PledgeForm (steps: details → method → order/drop → success)
              |      |       |
              |      |   [Step 2A: order]
              |      |       |
              |      |   fetch POST → mcp.swiggy.com/im (OAuth required)
              |      |       |
              |      |   search_products(addressId, query)
              |      |       |
              |      |   update_cart(selectedAddressId, [{spinId, quantity}])
              |      |       |
              |      |   checkout(addressId) → order confirmed in-situ
              |      |       |
              |      |   window.open("https://swiggy.com/instamart") [redirect]
              |      |       |
              |      |   PledgeForm state: "ordered" → "Mark as Ordered" button
              |      |
              |      +-- DonorPledges (Active / Completed tabs)
              |      +-- DonorImpact (stats + bar chart + [NEW] shareable card)
              |      +-- DonorProfile ([NEW] wired notification toggles)
              |
              +-- AdminApp.jsx  (useState: active screen)
                     |
                     +-- AdminDashboard → NeedsBoard ([FIX] edit modal)
                     +-- IncomingPledges (mark-as-received flow)
                     +-- DonationHistory ([FIX] search + date filter + export wiring)
                     +-- HomeProfileEdit ([NEW] QR code block via api.qrserver.com)

External services:
  api.qrserver.com  ←── <img> tag (no auth, GET, PNG response)
  mcp.swiggy.com/im ←── fetch JSON-RPC (OAuth 2.1 required, SSE/streaming)
```

### Recommended Project Structure
```
src/
├── DonorApp.jsx       # All Donor screens; add SwiggyMCP helper function here
├── AdminApp.jsx       # All Admin screens
├── index.css          # ALL styles — no new CSS files; extend existing
├── data.js            # Mock data — add "Ordered" status if needed
├── Icon.jsx           # Add any new icons needed (share, qr, cart)
├── App.jsx            # Root — no changes needed
├── LandingPage.jsx    # No changes this phase
├── LearnMorePage.jsx  # No changes this phase
└── GetStartedPage.jsx # No changes this phase
```

### Pattern 1: Extending `.empty` with Sub-elements
**What:** Add `.empty-icon`, `.empty-title`, `.empty-sub`, `.empty-cta` sub-elements inside `.empty`
**When to use:** Every list/table that can have zero items

```css
/* Source: existing .empty class at index.css:885 — extend with: */
.empty { text-align: center; padding: 40px 20px; color: var(--ink-3); }
.empty .icon { font-size: 32px; margin-bottom: 12px; opacity: 0.5; }
.empty .title { font-family: var(--serif); font-size: 18px; color: var(--ink); font-weight: 500; margin-bottom: 6px; }
.empty .sub { font-size: 13px; color: var(--ink-3); margin-bottom: 18px; line-height: 1.5; }
```

```jsx
// Usage in any component:
{list.length === 0 && (
  <div className="empty">
    <div className="icon">🌱</div>
    <div className="title">No pledges yet</div>
    <div className="sub">Start by browsing homes near you.</div>
    <button className="btn teal sm" onClick={() => go("browse")}>Browse homes</button>
  </div>
)}
```

### Pattern 2: Wiring Notification Toggles
**What:** Convert the static toggle array in `DonorProfile` to `useState`
**When to use:** FLOW-03 — notification toggles must update within session

```jsx
// Source: DonorApp.jsx:728 — DonorProfile current pattern (static)
// Replace with:
const [prefs, setPrefs] = useState({
  "Email alerts": true,
  "WhatsApp updates": true,
  "Monthly impact summary": false,
});
const toggle = (label) => setPrefs(p => ({ ...p, [label]: !p[label] }));

// In render:
{Object.entries(prefs).map(([label, on]) => (
  <div key={label} className="row between" style={{padding:"4px 0"}}>
    <div style={{fontSize:13.5}}>{label}</div>
    <button onClick={() => toggle(label)} style={{
      width:36, height:20, borderRadius:999,
      background: on ? "var(--teal)" : "var(--line)",
      border:"none", position:"relative", cursor:"pointer", transition:"all .15s",
    }}>
      <div style={{
        position:"absolute", top:2, left: on ? 18 : 2,
        width:16, height:16, borderRadius:"50%", background:"#fff",
        transition:"all .15s", boxShadow:"0 1px 2px rgba(0,0,0,0.15)"
      }}/>
    </button>
  </div>
))}
```

**Note:** BRD Section 3.7 specifies exactly 3 toggles: "Email alerts", "WhatsApp updates", "Monthly impact summary" (D-11). The existing 5-toggle list must be replaced with these 3.

### Pattern 3: QR Code via api.qrserver.com
**What:** Render QR code as `<img>` tag pointing to the free API
**When to use:** FLOW-02 — Admin HomeProfileEdit

```jsx
// Source: CONTEXT.md D-08 / D-09; verified live endpoint [VERIFIED: curl HTTP 200]
const homeSlug = "shanti-niketan"; // derive from form.name
const shareUrl = `https://needfeed.in/h/${homeSlug}`;
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(shareUrl)}&size=160x160`;

// In HomeProfileEdit, after the shareCard div:
<div className="card" style={{marginTop:14}}>
  <h3>QR code</h3>
  <p className="muted" style={{fontSize:12.5, marginTop:6}}>
    Print or display this to let donors scan and pledge directly.
  </p>
  <div style={{marginTop:14, display:"flex", gap:18, alignItems:"flex-start"}}>
    <img src={qrUrl} alt="Home QR code" width={160} height={160}
         style={{borderRadius:8, border:"1px solid var(--line)"}} />
    <div>
      <div className="tinyNote" style={{wordBreak:"break-all", marginBottom:10}}>{shareUrl}</div>
      <button className="btn outline sm" onClick={() => navigator.clipboard.writeText(shareUrl)}>
        <Icon name="copy" size={13}/> Copy link
      </button>
    </div>
  </div>
</div>
```

### Pattern 4: Swiggy MCP Call Sequence
**What:** Call Swiggy Instamart MCP tools in sequence from PledgeForm Step 2A
**When to use:** SWIGGY-01 / SWIGGY-02

The Swiggy MCP server uses JSON-RPC over streamable HTTP with OAuth 2.1 (phone + OTP). In a browser prototype context, the MCP session must already be established in the user's AI client OR the prototype calls the endpoint directly with a bearer token.

**Critical finding:** The Swiggy MCP `checkout` tool completes the order in-situ and returns an order confirmation object — it does NOT return a redirect URL. "Redirecting to Swiggy" means programmatically navigating to `https://www.swiggy.com/instamart` after a successful checkout call. [VERIFIED: Swiggy MCP official docs]

**MCP tool call flow:**

```javascript
// Step 1: Get saved addresses (user must have Swiggy account + address for home)
const addrResponse = await callSwiggyMCP("get_addresses", {});
const deliveryAddress = addrResponse.data.addresses[0]; // use first saved address

// Step 2: Search for the item
const searchResponse = await callSwiggyMCP("search_products", {
  addressId: deliveryAddress.id,
  query: itemName,  // e.g., "Atta" or "Toor Dal"
});
const product = searchResponse.data.products[0]; // first match

// Step 3: Update cart
const cartResponse = await callSwiggyMCP("update_cart", {
  selectedAddressId: deliveryAddress.id,
  items: [{ spinId: product.spinId, quantity: qty }],
});

// Step 4: Checkout
const orderResponse = await callSwiggyMCP("checkout", {
  addressId: deliveryAddress.id,
  // paymentMethod: auto-default (COD)
});

// Step 5: Redirect + update NeedFeed pledge state
window.open("https://www.swiggy.com/instamart", "_blank");
setPledgeStatus("ordered"); // new state in PledgeForm
```

```javascript
// MCP call wrapper
async function callSwiggyMCP(toolName, args) {
  const response = await fetch("https://mcp.swiggy.com/im", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${swiggyToken}`, // OAuth token
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/call",
      id: Date.now(),
      params: { name: toolName, arguments: args },
    }),
  });
  return response.json();
}
```

**Auth reality for prototype:** The Swiggy MCP OAuth flow is designed for AI clients (Claude Desktop, ChatGPT, Cursor). Calling it directly from a browser `fetch` requires the OAuth token obtained via PKCE. For a prototype demo, the planner should scope this as: attempt the MCP call, show the flow visually — if auth fails, display a graceful error per D-02 and still show the "Ordered" state path so the full UX is demonstrable.

### Pattern 5: Shareable Impact Card
**What:** A screenshot-worthy visual card at the bottom of DonorImpact
**When to use:** FLOW-01

```jsx
// Source: CONTEXT.md D-06, D-07
<div className="impactCard" style={{
  background: "linear-gradient(135deg, var(--teal-dark) 0%, var(--teal) 100%)",
  borderRadius: "var(--radius-lg)",
  padding: "32px 28px",
  color: "#fff",
  marginTop: 32,
  position: "relative",
  overflow: "hidden",
}}>
  <div style={{opacity:0.12, position:"absolute", ...}}>/* background decoration */</div>
  <div className="row" style={{marginBottom:24, justifyContent:"space-between"}}>
    <div>
      <div style={{fontFamily:"var(--serif)", fontSize:13, letterSpacing:"0.1em",
                   textTransform:"uppercase", opacity:0.8}}>NeedFeed</div>
      <div style={{fontSize:12, opacity:0.6, marginTop:2}}>My giving impact</div>
    </div>
    {/* NeedFeed mark */}
    <div style={{width:36, height:36, borderRadius:9, background:"rgba(255,255,255,0.2)",
                 display:"grid", placeItems:"center",
                 fontFamily:"var(--serif)", fontSize:18, fontWeight:600}}>N</div>
  </div>
  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20}}>
    {[
      ["28", "Pledges made"],
      ["9", "Homes supported"],
      ["412", "Residents helped"],
      ["5mo", "Giving streak"],
    ].map(([val, lbl]) => (
      <div key={lbl}>
        <div style={{fontFamily:"var(--serif)", fontSize:36, fontWeight:500,
                     lineHeight:1.05, letterSpacing:"-0.02em"}}>{val}</div>
        <div style={{fontSize:12, opacity:0.7, marginTop:4}}>{lbl}</div>
      </div>
    ))}
  </div>
  <p style={{fontSize:11.5, opacity:0.55, marginTop:24, textAlign:"center"}}>
    Press &amp; hold to save
  </p>
</div>
```

### Anti-Patterns to Avoid
- **Adding new CSS files:** All styles go in `index.css` — the project has a single stylesheet rule
- **Introducing state management libraries:** All state stays in `useState` — no Redux, Zustand, or Context API
- **Using `html2canvas` or Web Share API for impact card:** D-06 explicitly prohibits these
- **Using an npm QR library:** D-08 mandates `api.qrserver.com` via `<img>` tag
- **Storing notification toggle state in localStorage:** D-10 mandates session-state only
- **Creating a Swiggy deeplink instead of MCP call:** D-01 explicitly mandates MCP tool call
- **Hard-coding pixel values instead of CSS tokens:** UI-01 forbids one-off values; use `var(--teal)`, `var(--radius)`, `var(--shadow)` etc.
- **Using Tailwind or CSS modules:** The project uses plain CSS classes in index.css exclusively

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| QR code generation | Custom QR encoder | `api.qrserver.com` via `<img>` | Free, zero-dep, returns PNG, verified HTTP 200 |
| Toggle UI component | Custom animated toggle | Existing inline style pattern in DonorProfile | Pattern already exists in codebase; just wire to state |
| Status badge rendering | Custom badge JSX | `StatusBadge` / `ABadge` components | Already handles all statuses; reuse everywhere |
| Platform-specific button styles | Custom radio-like buttons | Existing pill/button pattern in Step 2A | Already styled; keep consistent |
| Icon SVGs | New icon system | Existing `Icon.jsx` component | 30+ icons already defined; add any missing ones there |

**Key insight:** The codebase is already highly componentized. Almost every new feature plugs into an existing component or CSS class — the primary work is wiring and extending, not building from scratch.

---

## Runtime State Inventory

This is a pure code / UI phase on a prototype with no backend. No runtime state migration is needed.

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | None — all data is static mock in `src/data.js` | None |
| Live service config | None — no backend, no external services in current build | None |
| OS-registered state | None | None |
| Secrets/env vars | None — no .env files, no backend calls | None |
| Build artifacts | None — Vite dev server; no compiled artifacts | None |

---

## Common Pitfalls

### Pitfall 1: Swiggy MCP Auth — Browser vs. AI Client Context
**What goes wrong:** The Swiggy MCP OAuth flow is designed for AI clients (Claude Desktop, ChatGPT) where the client manages the OAuth session. Calling `mcp.swiggy.com/im` from a browser `fetch` without a valid Bearer token returns `{"error":"invalid_token","error_description":"Authentication required"}` — confirmed by live test.
**Why it happens:** The Swiggy MCP server expects an OAuth 2.1 + PKCE token. Browser-native apps can't redirect to an OAuth flow inline in a `fetch` call.
**How to avoid:** Design the Swiggy integration in `PledgeForm` with a clear auth-gated UX: show an "Authenticate with Swiggy" step before the MCP call, or display a graceful demo-mode fallback per D-02 when the auth fails. The "Add to Swiggy Cart" button in the prototype can show the full intended flow even if the actual MCP call is not authenticated in demo mode.
**Warning signs:** HTTP 401/400 response from `mcp.swiggy.com/im`; error body `{"error":"invalid_token"}`.

### Pitfall 2: Swiggy checkout Does Not Redirect
**What goes wrong:** Decision D-01 says "redirect donor to Swiggy checkout" — but the MCP `checkout` tool places the order in-situ and returns an order object, not a URL. There is no checkout redirect URL in the MCP response. [VERIFIED: official Swiggy MCP docs]
**Why it happens:** The MCP `checkout` tool completes the full transaction including COD payment confirmation. The redirect in D-01 is a UX pattern, not a technical MCP redirect.
**How to avoid:** After a successful `checkout` call, use `window.open("https://www.swiggy.com/instamart", "_blank")` to open Swiggy so the donor can verify their order. Update PledgeForm state to `"ordered"` and display "Mark as Ordered" on NeedFeed side (SWIGGY-02).
**Warning signs:** Trying to use a `Location` header or `redirectUrl` field from the checkout response — these don't exist.

### Pitfall 3: Notification Toggles — Static JSX vs. Wired State
**What goes wrong:** `DonorProfile` currently renders toggles from a static hardcoded array: `[["New urgent need within 5km", true], ...]` — clicking them does nothing because there is no `onClick` handler and no state.
**Why it happens:** The original build rendered the visual but didn't wire the interaction.
**How to avoid:** Replace the static array with `useState({ "Email alerts": true, "WhatsApp updates": true, "Monthly impact summary": false })` and use a `toggle(label)` handler per D-10/D-11. Replace the existing 5 toggle labels with the 3 BRD-specified ones.
**Warning signs:** Toggle thumb doesn't move on click; no console state updates.

### Pitfall 4: Missing "Ordered" Status in PledgeForm + DonorPledges
**What goes wrong:** SWIGGY-02 requires the donor to be able to "mark pledge as Ordered" after Swiggy cart is populated. The current `PledgeForm` success state shows "Pledge confirmed!" but has no "Ordered" state or button. `DonorPledges` `MY_PLEDGES_SEED` does not include "Ordered" as a status.
**Why it happens:** Swiggy integration was not in the original build.
**How to avoid:** Add `"Ordered"` to the status flow. In `PledgeForm`, add an intermediate `"ordered"` step after Swiggy MCP call showing "Mark as Ordered on NeedFeed" button. Add `"Ordered"` to `StatusBadge` map and `MY_PLEDGES_SEED` can include an example "Ordered" pledge.
**Warning signs:** The step after "Open cart & order" button click goes straight to "Pledge confirmed!" without an intermediate return-from-Swiggy state.

### Pitfall 5: Admin NeedsBoard Edit Button Is a No-Op
**What goes wrong:** `NeedsBoard` in `AdminApp.jsx` has an Edit button (`<button className="btn ghost sm" title="Edit">`) with no `onClick` handler. BUG-02 requires this to work.
**Why it happens:** Edit modal was not implemented in the initial build.
**How to avoid:** Implement an inline edit pattern similar to the existing `AddNeedForm` — clicking Edit opens an inline form within the same row or replaces the row with an editable version. Keep it simple: re-use `AddNeedForm` fields, pre-populate with current values.
**Warning signs:** Clicking the Edit pencil icon does nothing.

### Pitfall 6: `.empty` is Currently Plain Text Only
**What goes wrong:** Current `.empty` class (index.css:885) is just `text-align:center; padding:40px 20px; color:var(--ink-3)`. Extending it with icon/title/subtitle/CTA sub-elements requires both CSS additions AND updating all call sites in JSX.
**Why it happens:** Original build added minimal empty state styles.
**How to avoid:** Add CSS sub-classes (`.empty .icon`, `.empty .title`, `.empty .sub`) in index.css, then update each call site. Existing call sites use simple string children (`"No pledges in this tab yet."`) — these must be replaced with structured JSX.
**Warning signs:** Empty state shows icon + title layout broken because parent still has `color:var(--ink-3)` which colors child elements.

### Pitfall 7: Desktop Responsiveness — `.urgentRow` at 1024px
**What goes wrong:** `.urgentRow` uses `grid-template-columns: repeat(3, 1fr)` which forces 3 columns regardless of viewport. At exactly 1024px with the 240px sidebar, the main area is ~784px — three columns at ~244px each is tight but workable. However, if card content overflows, columns compress awkwardly.
**Why it happens:** No min-width constraint on grid columns.
**How to avoid:** Add `minmax(200px, 1fr)` to `.urgentRow` or set a `min-width` on `.urgentCard`. Test at `1024px` viewport with browser DevTools.
**Warning signs:** UrgentCards collide or overflow horizontally at exactly 1024px.

### Pitfall 8: DonationHistory Search/Filter/Export are Visual-Only
**What goes wrong:** `DonationHistory` in `AdminApp.jsx` has no search input, no date filter, and the Export CSV button does nothing. BUG-02 requires these to work.
**Why it happens:** Per the existing code (lines 360–422), there are no filter state variables — it shows `HISTORY` directly from mock data with a static chart.
**How to avoid:** Add `useState` for search query and date filter, wire `useMemo` to filter `HISTORY` array. For Export CSV: generate a simple CSV string from filtered data and trigger a `Blob` download via a temporary anchor tag.
**Warning signs:** Searching in the input has no effect on the table; Export CSV does nothing.

---

## Code Examples

### Clipboard Copy (for QR page + Admin shareable link)
```javascript
// Source: [ASSUMED] — standard Web API, no library needed
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
};
```

### CSV Export (DonationHistory)
```javascript
// Source: [ASSUMED] — standard browser Blob + anchor pattern
const exportCSV = (data) => {
  const headers = ["Donor","Item","Qty","Date","Confirmed by"];
  const rows = data.map(r => [r.donor, r.item, r.qty, r.date, r.confirmedBy]);
  const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "donation-history.csv"; a.click();
  URL.revokeObjectURL(url);
};
```

### Focus Styles (WCAG 2.1 AA — UI-04)
```css
/* Source: [ASSUMED] — WCAG 2.1 AA requires visible focus indicator */
/* Add to index.css — global focus rule */
:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: 2px;
}
/* Suppress for mouse users (already handled by :focus-visible) */
```

### Swiggy MCP update_cart Parameters [VERIFIED: official docs]
```javascript
// update_cart tool schema (source: mcp.swiggy.com/builders/docs/reference/instamart/update_cart/)
{
  selectedAddressId: "addr_01HXYZ",  // from get_addresses
  items: [
    { spinId: "spin_42", quantity: 2 }  // spinId from search_products response
  ]
}
```

### Swiggy MCP search_products Parameters [VERIFIED: official docs]
```javascript
// search_products tool schema (source: mcp.swiggy.com/builders/docs/reference/instamart/search_products/)
{
  addressId: "addr_01HXYZ",  // delivery address ID
  query: "Atta",             // item name from pledge context
  offset: 0,                 // optional, default 0
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Static hardcoded toggle array | `useState` object with toggle handler | Phase 1 (this) | Toggles become interactive |
| `"No pledges in this tab yet."` string | Rich empty state with icon/title/CTA | Phase 1 (this) | UI-03 compliance |
| "Open cart & order" → immediate success | `search_products` → `update_cart` → `checkout` → redirect → "Mark as Ordered" | Phase 1 (this) | Full Swiggy MCP flow per D-01 |
| No QR code | `<img>` from `api.qrserver.com` | Phase 1 (this) | FLOW-02 compliance |
| No shareable impact card | Teal gradient card with serif stats | Phase 1 (this) | FLOW-01 compliance |

**Deprecated/outdated in this phase:**
- The static notification toggle list (5 items) → replaced with 3 BRD-specified items wired to state
- `"Order & Deliver"` method card pointing to Blinkit/JioMart/BigBasket → replaced with Swiggy MCP flow
- "Pay & we handle it" MethodCard (currently `disabled`) → remove or keep as "Coming soon" decoration

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | After Swiggy MCP `checkout`, navigating to `https://www.swiggy.com/instamart` shows the order to the user | Common Pitfalls #2, Code Examples | If Swiggy requires deep-link with order ID, the redirect is less useful; low risk since it's a prototype |
| A2 | The Swiggy MCP `search_products` response includes a `spinId` field on each product result | Code Examples (Swiggy MCP) | If field is named differently (e.g., `productId`), the `update_cart` call breaks; must be validated at execution time |
| A3 | `navigator.clipboard.writeText()` works without HTTPS in Vite dev server (`localhost`) | Code Examples | If browser blocks clipboard on localhost, the copy button silently fails; the fallback `execCommand` covers this |
| A4 | `api.qrserver.com` doesn't impose rate limits that would affect a demo prototype | Standard Stack | Free API may throttle; low risk for prototype use |

---

## Open Questions (RESOLVED)

1. **Swiggy MCP Auth in Browser** — RESOLVED: Implement the MCP call sequence with graceful error handling per D-02. Display a "Connect Swiggy account" prompt if no token. Full UX shown even if live MCP call is not reachable.
   - What we know: Swiggy MCP requires OAuth 2.1 (phone + OTP). The endpoint returns `{"error":"invalid_token"}` without a token.
   - What's unclear: Whether the NeedFeed prototype will be demoed inside an AI client (like Claude Desktop) that already holds the Swiggy OAuth session, or as a standalone browser tab.
   - Recommendation: Implement the MCP call sequence with graceful error handling per D-02. Display a "Connect Swiggy account" prompt if no token. For demo purposes, the full UX can be shown even if the live MCP call is not reachable.

2. **"Ordered" Status in DonorPledges** — RESOLVED: Add `"Ordered"` as a full status in both `StatusBadge` map and seed data (implemented in Plan 01-01 Task 2 and Plan 01-04).
   - What we know: SWIGGY-02 requires the donor to mark a pledge as "Ordered" after returning from Swiggy.
   - What's unclear: Should "Ordered" be a new status between "Pledged" and "Delivered" in `MY_PLEDGES_SEED` and `StatusBadge`? Or is it only an ephemeral state in `PledgeForm`?
   - Recommendation: Add `"Ordered"` as a full status in both `StatusBadge` map and seed data so the My Pledges tab reflects it correctly.

3. **Admin NeedsBoard Edit UX** — RESOLVED: Use inline `EditNeedForm` toggle pattern consistent with `AddNeedForm` (implemented in Plan 01-03 Task 1).
   - What we know: The Edit button exists but is a no-op.
   - What's unclear: BRD Section 4.2 may specify whether Edit opens a modal or inline form.
   - Recommendation: Use an inline edit pattern (toggle row to editable fields) consistent with `AddNeedForm` — avoids building a new modal component.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite dev server | ✓ | v24.15.0 | — |
| npm | Package management | ✓ | 11.12.1 | — |
| api.qrserver.com | FLOW-02 QR code | ✓ | — (HTTP 200 verified) | — |
| mcp.swiggy.com/im | SWIGGY-01/02 | ✓ (endpoint exists, auth required) | — | Graceful error per D-02; demo-mode fallback |
| Google Fonts (Manrope, Newsreader) | Typography | ✓ (already in index.html) | — | System fallback fonts already defined in :root |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** Swiggy MCP OAuth token — graceful error state per D-02.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None currently installed |
| Config file | None |
| Quick run command | `npm run dev` (manual verification in browser) |
| Full suite command | Manual — no automated test suite exists |

### Phase Requirements → Test Map

This is a UI/interaction phase on a prototype. All requirements are best verified by manual interaction in the browser (Playwright/Vitest would require significant setup overhead not warranted for a prototype polish milestone).

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UI-01 | No one-off color/spacing values | Visual / CSS audit | Manual browser inspection | ❌ N/A |
| UI-02 | Badge colors match BRD hex values | Visual | Manual comparison | ❌ N/A |
| UI-03 | Empty states show icon + title + CTA | Visual | Manual (clear mock data) | ❌ N/A |
| UI-04 | Hover/focus/active feedback visible | Visual / keyboard nav | Manual | ❌ N/A |
| FLOW-01 | Impact card renders with all 4 stats | Visual | Manual | ❌ N/A |
| FLOW-02 | QR code image loads from api.qrserver.com | Visual + Network tab | Manual | ❌ N/A |
| FLOW-03 | Toggle state updates on click and persists in session | Interaction | Manual | ❌ N/A |
| SWIGGY-01 | MCP call sequence initiated on "Add to Swiggy Cart" | Network + Console | Manual + Network DevTools | ❌ N/A |
| SWIGGY-02 | "Mark as Ordered" button appears after Swiggy flow | Interaction | Manual | ❌ N/A |
| DESK-01/02 | All screens usable at 1024px | Responsive | Manual (DevTools 1024px) | ❌ N/A |
| BUG-01/02 | All buttons/modals/transitions work | Interaction | Manual walkthrough | ❌ N/A |

### Wave 0 Gaps
No automated test infrastructure is present. For this prototype polish phase, the planner should include a dedicated "Manual verification checklist" task at the end of each wave rather than Vitest/Playwright setup. Setting up a test framework would exceed the scope of a prototype polish milestone.

*(If test infrastructure is desired: install `vitest` + `@testing-library/react` and create smoke tests for empty state rendering and toggle state. This is out of scope per current constraints.)*

---

## Security Domain

`security_enforcement: true` in config.json; ASVS Level 1.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No — no auth in this milestone | N/A (deferred to v2) |
| V3 Session Management | No — session-state only (no cookies, no tokens stored) | N/A |
| V4 Access Control | No — no roles/permissions in prototype | N/A |
| V5 Input Validation | Partial — QR URL construction, pledge form qty field | Sanitize `form.name` before inserting into QR URL; qty input is `type="number"` already |
| V6 Cryptography | No — no encryption needed | N/A |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via unsanitized home name in QR URL | Tampering | `encodeURIComponent()` on all URL parameters — already shown in code examples |
| Unvalidated number input in PledgeForm | Tampering | `type="number"` already present; add `min={1}` and `max` constraints |
| `window.open` popunder (Swiggy redirect) | Spoofing | Use `window.open(url, "_blank", "noopener,noreferrer")` to prevent opener access |
| Clipboard API access on non-HTTPS | Elevation of Privilege | Localhost counts as secure context for clipboard; fallback `execCommand` handles edge cases |

**Security note:** WCAG 2.1 AA accessibility is a BRD non-functional requirement. This implies: all interactive elements need `aria-label` or visible text labels, all focus states must be visible (`:focus-visible` rule), and color alone must not convey meaning (badges use both color AND dot + text).

---

## Sources

### Primary (HIGH confidence)
- [VERIFIED: mcp.swiggy.com/builders/docs/reference/instamart/update_cart/] — `update_cart` parameters: `selectedAddressId` (string), `items` array with `{ spinId, quantity }`
- [VERIFIED: mcp.swiggy.com/builders/docs/reference/instamart/search_products/] — `search_products` parameters: `addressId` (string), `query` (string), `offset` (optional)
- [VERIFIED: mcp.swiggy.com/builders/docs/reference/instamart/checkout/] — `checkout` does NOT return a redirect URL; places order in-situ; cart limit ₹1000
- [VERIFIED: mcp.swiggy.com/builders/docs/reference/instamart/create_address/] — full `create_address` parameter schema
- [VERIFIED: live endpoint test] — `api.qrserver.com/v1/create-qr-code/?data=test&size=160x160` → HTTP 200
- [VERIFIED: live endpoint test] — `mcp.swiggy.com/im` requires OAuth: returns `{"error":"invalid_token"}` without auth
- [VERIFIED: codebase read] — `src/index.css`, `src/DonorApp.jsx`, `src/AdminApp.jsx`, `src/data.js` — all patterns, components, and integration points confirmed

### Secondary (MEDIUM confidence)
- [CITED: mcp.swiggy.com/builders/docs/reference/instamart/] — 13 Instamart tools: discover (5), cart (3), order (1), track (3), support (1)
- [CITED: mcp.swiggy.com/builders/] — OAuth 2.1 with PKCE; COD payment supported; orders > ₹1000 require native app

### Tertiary (LOW confidence)
- [ASSUMED: A2] — `spinId` field name in `search_products` response — not confirmed from docs excerpt; field must be validated at implementation time

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — codebase fully read, no new packages needed
- Architecture: HIGH — all integration points located in source code
- Swiggy MCP tool schemas: HIGH — official docs directly fetched, parameters verified
- Swiggy auth/checkout flow: MEDIUM — checkout behavior confirmed as in-situ; redirect UX is interpretive per D-01
- Pitfalls: HIGH — most derived from direct code reading; Swiggy pitfalls from official docs + live endpoint test

**Research date:** 2026-05-24
**Valid until:** 2026-06-24 (stable UI stack); Swiggy MCP tool schemas valid for ~30 days (API in active development)
