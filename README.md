# NeedFeed

> **A donor can see what a nursing home needs and pledge specific items in under 60 seconds.**

NeedFeed is a web-based platform connecting individual donors with nursing homes and old age homes that need daily-use supplies — atta, dal, rice, oil, toiletries, medicines. Donors browse a live needs board, pledge specific items, and choose how to fulfil the pledge. Home admins manage their needs board and track incoming pledges through a separate dashboard.

---

## Screenshots

| Donor — Browse Homes | Admin — Needs Board |
|---|---|
| _Browse urgent needs near you_ | _Manage your home's supply requests_ |

---

## Features

### Donor App
- **Home dashboard** — urgency card grid showing homes with active needs near you
- **Browse & search** — filter homes by category; search by name or area
- **Pledge flow** — pick an item, set quantity, choose fulfilment method (drop-off or Swiggy Instamart), schedule a date
- **Swiggy Instamart integration** — "Add to Swiggy Cart" flow: authenticates, searches products, adds to cart, and proceeds to checkout via the Swiggy MCP API
- **My Pledges** — track active and completed pledges with live status badges (Pledged → Ordered → Delivered → Confirmed)
- **Impact page** — shareable teal gradient card showing total pledges, homes supported, residents helped, and giving streak
- **Profile** — notification preference toggles (email, WhatsApp, monthly summary)

### Home Admin App
- **Dashboard** — live stats (active needs, incoming pledges, delivery rate, coverage %) + activity feed
- **Needs board** — add, edit inline, and filter supply requests by urgency; progress bars show pledge coverage
- **Incoming pledges** — track expected deliveries by date; mark as received
- **Donation history** — search by donor or item, filter by date, export to CSV
- **Home profile** — edit home details, copy shareable donor link, display QR code for direct donor access

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Plain CSS with CSS custom property design tokens |
| Data | Mock data (no backend — all interactions work offline) |
| External API | Swiggy Instamart MCP (`mcp.swiggy.com/im`) — donor flow only |

No router, no state management library, no CSS framework. The entire app is two JSX files (`DonorApp.jsx` and `AdminApp.jsx`) sharing one CSS file.

---

## Prerequisites

- **Node.js** 18 or later — [download](https://nodejs.org/)
- **npm** 9 or later (comes with Node)
- A modern browser — Chrome, Safari, or Firefox (latest 2 versions)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/TusharBhatia10/Need_Feed.git
cd Need_Feed
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

Use the **toggle in the top-right corner** to switch between the Donor view and the Home Admin view.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with hot reload at http://localhost:5173 |
| `npm run build` | Build for production into the `dist/` folder |
| `npm run preview` | Preview the production build locally |

---

## Project Structure

```
src/
├── main.jsx          # Entry point — mounts App
├── index.css         # Global styles and CSS design tokens
├── App.jsx           # Root component — view toggle (Donor / Admin)
├── DonorApp.jsx      # Full donor-facing application
├── AdminApp.jsx      # Full home admin application
├── Icon.jsx          # SVG icon component
└── data.js           # Shared mock data (homes, pledges, history)

.planning/            # GSD planning artifacts (roadmap, phase plans, research)
```

---

## Design System

All colors, spacing, typography, and border radii are defined as CSS custom properties in `:root` inside `index.css`. No hardcoded hex values in component styles.

Key tokens:

```css
--teal           /* primary brand color */
--teal-dark      /* hover / emphasis */
--teal-light     /* badge backgrounds, tints */
--coral          /* urgent / error states */
--amber          /* warning / partial states */
--green          /* confirmed / covered states */
--serif          /* Newsreader — display headings and impact card */
--sans           /* Inter — UI text */
```

---

## Swiggy Integration (Demo)

The "Order & Deliver" pledge path integrates with the Swiggy Instamart MCP API:

1. Donor selects **Order & Deliver** in the pledge flow
2. Clicks **Add to Swiggy Cart** — prompts for a Swiggy auth token (demo entry)
3. App calls the MCP sequence: `get_addresses` → `search_products` → `update_cart` → `checkout`
4. On success: shows **Go to Swiggy** (opens `swiggy.com/instamart` in new tab) + **Mark as Ordered on NeedFeed**
5. On failure: shows an inline error card with a **Try again** button — no automatic fallback to other platforms

> **Note:** A real Swiggy OAuth token is required for the MCP calls to succeed. In demo mode, the flow will reach the error state, which is the expected behaviour without a valid token.

---

## Accessibility

- WCAG 2.1 AA focus indicators — `:focus-visible` shows a 2px teal outline on all interactive elements
- Notification toggle buttons use `role="switch"` and `aria-checked`
- All images have `alt` attributes
- Colour contrast meets AA ratios across all badge and text combinations

---

## Browser Support

Chrome, Safari, Firefox — latest 2 major versions. Not optimised for mobile (375px / 768px responsiveness is a v2 milestone item).

---

## Roadmap

| Version | Scope |
|---|---|
| v1.0 (current) | Prototype polish — complete donor and admin flows with mock data |
| v2.0 | Supabase backend, real auth (email + OTP), mobile responsiveness, Option C payment flow |

---

## Contributing

This project is a prototype built for stakeholder demos. If you find a bug or want to suggest an improvement, open an issue on GitHub.

---

## License

MIT
