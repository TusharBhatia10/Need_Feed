# Requirements: NeedFeed

**Defined:** 2026-05-24
**Core Value:** A donor can see what a nursing home needs and pledge specific items in under 60 seconds.

## v1 Requirements

Prototype polish milestone — UI quality, missing flows, Swiggy integration, and desktop responsiveness.

### UI Polish

- [ ] **UI-01**: All screens use a consistent spacing scale, color token system, and typography hierarchy (no one-off values)
- [ ] **UI-02**: All cards, badges, buttons, and modals match the BRD visual specification exactly (correct labels, states, colors per Section 3.1.2 and Section 4 of BRD)
- [x] **UI-03**: Every list or table view that can be empty has a purposeful empty state (zero pledges, zero needs, zero history entries, zero browse results)
- [ ] **UI-04**: All interactive elements have hover, focus, and active feedback; async-style state changes (e.g., marking a pledge received) show clear visual confirmation

### Missing Flows

- [x] **FLOW-01**: Donor can view a shareable impact card on the Impact page — a visually-designed card with their stats that can be screenshotted or shared
- [ ] **FLOW-02**: Admin can view and copy their home's auto-generated QR code on the Home Profile edit page (links to the home's public NeedFeed URL)
- [x] **FLOW-03**: Donor notification preference toggles on the Profile page save and restore state correctly within the session

### Swiggy Integration

- [x] **SWIGGY-01**: In the Pledge Flow Step 2A, donor can add the pledged item directly to a Swiggy cart via the Swiggy MCP API (item name + quantity + home's delivery address pre-filled)
- [x] **SWIGGY-02**: After the Swiggy cart is populated, the donor is redirected to Swiggy to complete payment; on return, they can mark the pledge as "Ordered" on NeedFeed

### Desktop Responsiveness

- [ ] **DESK-01**: All Donor App screens render correctly and are fully usable at 1024px and wider viewports
- [ ] **DESK-02**: All Admin Dashboard screens render correctly and are fully usable at 1024px and wider viewports

### Bug Audit & Fixes

- [x] **BUG-01**: Full interaction audit of the Donor App — all navigation, buttons, modals, pledge flow steps, tab toggles, and status transitions work correctly with mock data
- [ ] **BUG-02**: Full interaction audit of the Admin Dashboard — all navigation, needs board CRUD, incoming pledge flows, mark-as-received, and history filtering work correctly with mock data

## v2 Requirements

### Authentication

- **AUTH-01**: Donor can create an account with email + OTP (Supabase Auth)
- **AUTH-02**: Home admin can create an account with email + OTP (Supabase Auth)
- **AUTH-03**: User session persists across browser refresh
- **AUTH-04**: User can sign out from any page

### Backend

- **BACK-01**: All data is stored in Supabase PostgreSQL (users, homes, needs, pledges, deliveries)
- **BACK-02**: Pledge quantities update in real-time across all donor sessions (Supabase Realtime)
- **BACK-03**: Home admin can register their home and submit for NGO verification

### Mobile

- **MOB-01**: All screens are responsive and usable at 375px (mobile)
- **MOB-02**: Sidebar collapses to bottom tab bar at 768px (tablet/mobile)

### Notifications

- **NOTF-01**: Donor receives WhatsApp reminder 24 hours before a drop-off pledge
- **NOTF-02**: Home admin receives in-app notification when a new pledge is made
- **NOTF-03**: Donor receives WhatsApp/in-app confirmation when home confirms receipt
- **NOTF-04**: Donor receives monthly impact summary email

### Language

- **LANG-01**: Hindi translation of core donor flows (v2 per BRD)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Option C — Pay & handle it (UPI payment, NGO partner fulfilment) | Replaced by Swiggy direct cart integration; NGO supplier network not yet established |
| Supabase backend / real database | Deferred until prototype is polished; all data remains mock in this milestone |
| Authentication (Email + OTP) | No login required for prototype polish milestone |
| WhatsApp / email notifications | Requires real user data and backend |
| Razorpay / Cashfree payment gateway | Tied to Option C which is out of scope |
| Mobile responsive (375px, 768px) | Desktop-only for this milestone; deferred to v2 |
| Hindi language support | Explicitly v2 per BRD |
| Donor reliability score | Listed as "future" in BRD |
| Admin NGO verification flow | Requires backend infrastructure |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 1 | Pending |
| UI-03 | Phase 1 | Complete (01-02) |
| UI-04 | Phase 1 | Pending |
| FLOW-01 | Phase 1 | Complete (01-02) |
| FLOW-02 | Phase 1 | Pending |
| FLOW-03 | Phase 1 | Complete (01-02) |
| DESK-01 | Phase 1 | Pending |
| DESK-02 | Phase 1 | Pending |
| BUG-01 | Phase 1 | Complete (01-02) |
| BUG-02 | Phase 1 | Pending |
| SWIGGY-01 | Phase 1 | Complete (01-04) |
| SWIGGY-02 | Phase 1 | Complete (01-04) |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-24*
*Last updated: 2026-05-24 after roadmap creation*
