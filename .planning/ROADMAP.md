# Roadmap: NeedFeed

**Milestone:** Prototype Polish
**Requirements:** 13 v1 requirements
**Phases:** 1

## Phases

- [ ] **Phase 1: Complete Prototype Polish** - Audit and fix all interactions, apply full UI polish, add missing flows, lock desktop responsiveness, and integrate Swiggy cart

## Phase Details

### Phase 1: Complete Prototype Polish
**Goal**: The prototype is clean, complete, fully interactive, and Swiggy-connected — every screen looks polished, every button works, no BRD screen is missing, and donors can add pledges directly to a Swiggy cart
**Depends on**: Nothing (first phase)
**Requirements**: UI-01, UI-02, UI-03, UI-04, FLOW-01, FLOW-02, FLOW-03, DESK-01, DESK-02, BUG-01, BUG-02, SWIGGY-01, SWIGGY-02
**Success Criteria** (what must be TRUE):
  1. Every screen across both Donor App and Admin Dashboard uses consistent spacing, color tokens, and typography — no one-off values visible anywhere
  2. All cards, badges, buttons, and modals match BRD visual specs exactly (correct labels, states, and colors per BRD Sections 3.1.2 and 4)
  3. All empty states are purposeful — zero pledges, zero needs, zero browse results, and zero history each display a meaningful message
  4. All interactive elements show hover, focus, and active feedback; status changes (mark received, mark delivered) confirm visually without a page reload
  5. Donor Impact page has a shareable impact card; Admin Home Profile has a copyable QR code; notification toggles persist within a session; all screens fully usable at 1024px and wider
  6. In Pledge Flow Step 2A, "Add to Swiggy Cart" calls the Swiggy MCP API with item, quantity, and home delivery address pre-filled; donor is redirected to Swiggy, then can return and mark pledge as "Ordered"
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Complete Prototype Polish | 0/? | Not started | - |

---
*Roadmap created: 2026-05-24*
*Milestone: Prototype Polish*
