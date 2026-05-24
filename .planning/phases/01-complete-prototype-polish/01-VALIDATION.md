---
phase: 1
slug: complete-prototype-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-24
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None currently installed — prototype polish phase |
| **Config file** | none |
| **Quick run command** | `npm run dev` (manual verification in browser) |
| **Full suite command** | Manual — no automated test suite |
| **Estimated runtime** | ~5 minutes per manual walkthrough |

---

## Sampling Rate

- **After every task commit:** Open browser at localhost and verify the changed component visually
- **After every plan wave:** Full manual walkthrough of all affected screens
- **Before `/gsd:verify-work`:** Complete manual walkthrough across both Donor App and Admin Dashboard
- **Max feedback latency:** ~5 minutes

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-UI-tokens | TBD | 1 | UI-01 | — | N/A | Visual CSS audit | Manual browser inspection | ❌ N/A | ⬜ pending |
| 01-badge-colors | TBD | 1 | UI-02 | — | N/A | Visual comparison | Manual color check | ❌ N/A | ⬜ pending |
| 01-empty-states | TBD | 1 | UI-03 | — | N/A | Visual + interaction | Manual (clear mock data) | ❌ N/A | ⬜ pending |
| 01-interactive-feedback | TBD | 1 | UI-04 | — | N/A | Visual + keyboard nav | Manual | ❌ N/A | ⬜ pending |
| 01-impact-card | TBD | 2 | FLOW-01 | — | N/A | Visual | Manual | ❌ N/A | ⬜ pending |
| 01-qr-code | TBD | 2 | FLOW-02 | T-V5-QR | QR URL encodes user-controlled data safely (encodeURIComponent) | Visual + Network tab | Manual | ❌ N/A | ⬜ pending |
| 01-notif-toggles | TBD | 2 | FLOW-03 | — | N/A | Interaction | Manual | ❌ N/A | ⬜ pending |
| 01-swiggy-mcp | TBD | 3 | SWIGGY-01 | T-V5-FORM | Quantity input is type="number"; no XSS vectors in cart payload | Network + Console | Manual + DevTools | ❌ N/A | ⬜ pending |
| 01-ordered-state | TBD | 3 | SWIGGY-02 | — | N/A | Interaction | Manual | ❌ N/A | ⬜ pending |
| 01-desktop-1024 | TBD | 1 | DESK-01, DESK-02 | — | N/A | Responsive | Manual (DevTools 1024px) | ❌ N/A | ⬜ pending |
| 01-bug-fixes | TBD | 1 | BUG-01, BUG-02 | — | N/A | Interaction walkthrough | Manual | ❌ N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No automated test infrastructure is required for this phase. This is a prototype polish milestone — Vitest/Playwright setup would exceed the scope.

*Existing verification approach: manual browser walkthrough after each task.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No one-off color/spacing values visible | UI-01 | CSS visual audit | Open DevTools, inspect card/button/text elements, confirm CSS variables used, no hardcoded hex/px values |
| Badge colors match BRD hex (#0F6E56, #B8860B, #3B6D11, #D85A30) | UI-02 | Color comparison | Open browser, compare badge colors against BRD Section 3.1.2 spec |
| Empty states show icon + bold title + muted subtitle + CTA | UI-03 | Visual / state simulation | Clear mock data or use empty arrays; verify My Pledges, Needs Board, Browse Results, History each render the pattern |
| All buttons show hover/focus/active feedback | UI-04 | Interaction | Tab through all buttons, hover over cards, click interactive elements |
| Impact card renders with 4 stats + brand mark | FLOW-01 | Visual | Navigate to Donor Impact page, verify totals, streak, brand mark |
| QR code loads from api.qrserver.com | FLOW-02 | Network tab | Open Admin Home Profile, verify `<img>` src returns HTTP 200 from api.qrserver.com |
| Notification toggles persist in session | FLOW-03 | Interaction | Toggle each of 3 settings, navigate away, return, confirm state retained |
| "Add to Swiggy Cart" triggers MCP call sequence | SWIGGY-01 | Network + Console | Step through PledgeForm Step 2A, click Add to Swiggy Cart, observe console logs for MCP tool calls |
| "Mark as Ordered" state appears after Swiggy flow | SWIGGY-02 | Interaction | Complete Swiggy flow, confirm pledge state transitions to show "Mark as Ordered" |
| All screens usable at 1024px viewport | DESK-01, DESK-02 | Responsive | Set DevTools to 1024px, walk through all Donor App and Admin screens |
| All interactive elements functional | BUG-01, BUG-02 | Full walkthrough | Click every button, modal, transition — no no-ops |

---

## Validation Sign-Off

- [ ] All tasks have manual verification steps documented
- [ ] Wave 0 gap: no automated tests (acknowledged — prototype scope)
- [ ] Security V5 input controls confirmed for QR URL construction and pledge quantity
- [ ] Full manual walkthrough planned before `/gsd:verify-work`
- [ ] `nyquist_compliant: true` set in frontmatter when walkthrough complete

**Approval:** pending
