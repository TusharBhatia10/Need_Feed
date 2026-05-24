# Phase 1: Complete Prototype Polish - Pattern Map

**Mapped:** 2026-05-24
**Files analyzed:** 6 (4 modified, 2 touched in parallel)
**Analogs found:** 6 / 6

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/DonorApp.jsx` — `PledgeForm` (line 377) | component | request-response (async fetch) | `src/AdminApp.jsx` — `IncomingPledges.markReceived` (line 305) | role-match |
| `src/DonorApp.jsx` — `DonorImpact` (line 639) | component | transform (mock data → visual) | `src/DonorApp.jsx` — existing `DonorImpact` stats block (line 659) | exact |
| `src/DonorApp.jsx` — `DonorProfile` (line 728) | component | event-driven (toggle state) | `src/DonorApp.jsx` — existing toggle JSX (line 755) | exact |
| `src/AdminApp.jsx` — `HomeProfileEdit` (line 424) | component | CRUD + external API (`<img>` tag) | `src/AdminApp.jsx` — existing `shareCard` div (line 479) | exact |
| `src/AdminApp.jsx` — `NeedsBoard` (line 214) | component | CRUD | `src/AdminApp.jsx` — `AddNeedForm` (line 179) | exact |
| `src/AdminApp.jsx` — `DonationHistory` (line 360) | component | CRUD + batch (search/filter/export) | `src/DonorApp.jsx` — `DonorBrowse` (line 197) with `useMemo` filter | role-match |
| `src/index.css` — `.empty` extension (line 885) | utility / CSS | — | existing `.empty` at line 885 + `.badge` sub-element pattern at line 396 | exact |
| `src/data.js` — `"Ordered"` status addition | model | — | `MY_PLEDGES_SEED` in `DonorApp.jsx` line 558 | exact |

---

## Pattern Assignments

### `src/DonorApp.jsx` — `PledgeForm` Step 2A Swiggy MCP (lines 486–516)

**Analog:** `src/AdminApp.jsx` — `IncomingPledges` mark-received mutation pattern (lines 294–357) and `PledgeForm` success card (lines 399–426)

**Imports pattern** (DonorApp.jsx lines 1–4):
```jsx
import { useState, useMemo } from 'react'
import Icon from './Icon'
import DatePicker from './DatePicker'
import { initials, HOMES, RECENT_DONORS, DONOR_PLEDGES } from './data'
```

**Existing step-state machine pattern** (PledgeForm lines 378–397):
```jsx
const [step, setStep] = useState("details");
// step values: "details" | "method" | "order" | "drop" | "success"
// Add: "swiggy-loading" | "swiggy-error" | "swiggy-success"

const goBack = () => {
  if (step === "details") onClose();
  else if (step === "method") setStep("details");
  else if (step === "order" || step === "drop") setStep("method");
  else onClose();
};
```

**Current Step 2A trigger button** (PledgeForm lines 508–515) — REPLACE THIS:
```jsx
<button className="btn teal block lg" style={{marginTop:12}} onClick={() => setStep("success")}>
  <Icon name="arrow" size={14}/> Open cart & order
</button>
<p className="tinyNote" style={{textAlign:"center", marginTop:10}}>After ordering, come back here and confirm your pledge</p>
```

**Async state mutation pattern to copy from** (AdminApp.jsx lines 305–307):
```jsx
const markReceived = (id) => {
  setPledges(pledges.map(p => p.id === id ? { ...p, status: "Confirmed", when: "received" } : p));
};
```

**Success card structure to copy for Swiggy confirmation** (PledgeForm lines 399–426):
```jsx
if (step === "success") {
  return (
    <div className="pledgeWrap success fadeIn">
      <div className="card" style={{padding:"36px 28px", textAlign:"center"}}>
        <div className="checkBig"><Icon name="checkBig" size={36}/></div>
        <h1 style={{fontSize:28}}>Pledge confirmed!</h1>
        ...
        <div className="row" style={{justifyContent:"center", gap:10, marginTop:22}}>
          <button className="btn teal lg" onClick={onClose}>Back to home</button>
        </div>
      </div>
    </div>
  );
}
```

**Inline error card pattern to copy from** (AdminApp.jsx lines 451–454 — saved confirmation style, adapt for error):
```jsx
<div className="card fadeIn" style={{
  borderColor:"var(--coral-light)", background:"var(--coral-light)",
  color:"var(--coral)", marginBottom:18, padding:"12px 16px",
  display:"flex", alignItems:"center", gap:10, fontWeight:600, fontSize:13
}}>
  <Icon name="x" size={16}/> {errorMessage}
  <button className="btn ghost sm" style={{marginLeft:"auto"}} onClick={retrySwiggy}>Retry</button>
</div>
```

**Platform pill selection pattern to copy** (PledgeForm lines 491–502):
```jsx
{["Blinkit","JioMart","BigBasket"].map(p => (
  <button key={p} type="button" onClick={() => setPlatform(p)} style={{
    flex:1, padding:"14px 8px", borderRadius:10,
    border:"1.5px solid " + (platform === p ? "var(--teal)" : "var(--line)"),
    background: platform === p ? "var(--teal-tint)" : "var(--surface)",
    fontWeight:600, fontSize:13.5,
    color: platform === p ? "var(--teal-dark)" : "var(--ink-2)",
    cursor:"pointer", transition:"all .12s",
  }}>{p}</button>
))}
```
Replace `["Blinkit","JioMart","BigBasket"]` with `["Swiggy"]` (single platform); keep the same pill button style.

**window.open security pattern** (index.css/security note — use these exact attributes):
```jsx
window.open("https://www.swiggy.com/instamart", "_blank", "noopener,noreferrer");
```

---

### `src/DonorApp.jsx` — `DonorImpact` shareable card addition (after line 725)

**Analog:** `src/DonorApp.jsx` — existing `DonorImpact` stats block (lines 659–680) and `DonorImpact` top-homes card (lines 704–722)

**Existing stats block to read values from** (DonorImpact lines 659–680):
```jsx
<div className="statsRow">
  <div className="stat featured">
    <div className="label">Total pledges</div>
    <div className="value">28</div>
    <div className="delta">since Feb 2025</div>
  </div>
  <div className="stat">
    <div className="label">Homes supported</div>
    <div className="value">9</div>
  </div>
  <div className="stat">
    <div className="label">Residents helped</div>
    <div className="value">412</div>
  </div>
  <div className="stat">
    <div className="label">Streak</div>
    <div className="value">5<span style={{fontSize:18, color:"var(--ink-3)", marginLeft:4}}>mo</span></div>
  </div>
</div>
```

**Stat serif number style to copy** (index.css lines 322–329):
```css
.stat .value {
  font-family: var(--serif);
  font-size: 34px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-weight: 500;
  margin-top: 8px;
  color: var(--ink);
}
```

**Card container pattern** (AdminApp.jsx lines 487–499):
```jsx
<div className="card" style={{marginTop:14}}>
  ...content...
  <p className="tinyNote" style={{marginTop:10}}>...</p>
</div>
```

**Brand token values available for gradient** (index.css lines 4–6):
```css
--teal: #1D9E75;
--teal-dark: #0F6E56;
--radius-lg: 18px;
```

**grid 2-col stat layout to copy** (DonorImpact already uses 4 stat divs; use `gridTemplateColumns:"1fr 1fr"` for card layout):
```jsx
<div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20}}>
```

---

### `src/DonorApp.jsx` — `DonorProfile` notification toggles (lines 728–783)

**Analog:** `src/DonorApp.jsx` — existing static toggle render (lines 755–778) — copy structure, wire to state

**Existing static toggle markup to convert** (DonorProfile lines 755–778):
```jsx
{[
  ["New urgent need within 5km", true],
  ["Weekly digest of nearby homes", true],
  ...
].map(([label, on]) => (
  <div key={label} className="row between" style={{padding:"4px 0"}}>
    <div style={{fontSize:13.5}}>{label}</div>
    <div style={{
      width:36, height:20, borderRadius:999,
      background: on ? "var(--teal)" : "var(--line)",
      position:"relative", transition:"all .15s"
    }}>
      <div style={{
        position:"absolute", top:2, left: on ? 18 : 2,
        width:16, height:16, borderRadius:"50%", background:"#fff",
        transition:"all .15s",
        boxShadow:"0 1px 2px rgba(0,0,0,0.15)"
      }}/>
    </div>
  </div>
))}
```
Replace static array + non-interactive `<div>` toggle with `useState` + `<button>`.

**useState initialization pattern** (matches existing NeedsBoard line 215–217):
```jsx
const [filter, setFilter] = useState("all");
// Apply same pattern:
const [prefs, setPrefs] = useState({
  "Email alerts": true,
  "WhatsApp updates": true,
  "Monthly impact summary": false,
});
const toggle = (label) => setPrefs(p => ({ ...p, [label]: !p[label] }));
```

**Button vs div — use `<button>` for accessibility** (index.css line 53):
```css
button { font: inherit; color: inherit; cursor: pointer; }
```
Replace the `<div>` toggle container with `<button onClick={() => toggle(label)} ...>`.

---

### `src/AdminApp.jsx` — `HomeProfileEdit` QR code block (after line 486)

**Analog:** `src/AdminApp.jsx` — existing `shareCard` div (lines 479–486)

**Existing shareCard to insert QR below** (HomeProfileEdit lines 479–486):
```jsx
<div className="shareCard">
  <h3 style={{display:"flex", alignItems:"center", gap:8}}>
    <Icon name="arrow" size={16}/> Your NeedFeed link
  </h3>
  <p className="muted" style={{fontSize:12.5, marginTop:6}}>...</p>
  <div className="url">
    <span>needfeed.in/h/shanti-niketan</span>
    <button className="btn ghost sm"><Icon name="copy" size={13}/> Copy</button>
  </div>
</div>
```

**form.name is already in state** (HomeProfileEdit lines 426–434):
```jsx
const [form, setForm] = useState({
  name: "Shanti Niketan Home",
  ...
});
```
Use `form.name` to derive the slug: `form.name.toLowerCase().replace(/\s+/g, "-")`.

**Saved/feedback pattern to copy for copy-link confirmation** (HomeProfileEdit lines 450–454):
```jsx
{saved && (
  <div className="card fadeIn" style={{
    borderColor:"var(--green-light)", background:"var(--green-light)",
    color:"#4a7517", marginBottom:18, padding:"12px 16px",
    display:"flex", alignItems:"center", gap:10, fontWeight:600, fontSize:13
  }}>
    <Icon name="check" size={16}/> Profile saved.
  </div>
)}
```
Copy this pattern for `{copied && ...}` link-copied feedback.

**card layout used for Live Preview** (lines 487–500) — copy for QR card:
```jsx
<div className="card">
  <h3>QR code</h3>
  <p className="muted" style={{fontSize:12.5, marginTop:6}}>...</p>
  <div style={{marginTop:14, display:"flex", gap:18, alignItems:"flex-start"}}>
    {/* <img> + copy button side-by-side */}
  </div>
</div>
```

**Icon available for copy button** (Icon.jsx line 33):
```jsx
case "copy": return <svg ...>...</svg>;
```

**encodeURIComponent for QR URL** — required for security (RESEARCH.md security section):
```jsx
const shareUrl = `https://needfeed.in/h/${slug}`;
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(shareUrl)}&size=160x160`;
```

---

### `src/AdminApp.jsx` — `NeedsBoard` Edit button wiring (line 280)

**Analog:** `src/AdminApp.jsx` — `AddNeedForm` component (lines 179–212)

**AddNeedForm pattern to reuse as EditNeedForm** (lines 179–211):
```jsx
function AddNeedForm({ onAdd, onCancel }) {
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("Grains");
  const [needed, setNeeded] = useState("");
  const [unit, setUnit] = useState("kg");
  return (
    <div className="card fadeIn" style={{borderColor:"var(--teal-light)", background:"var(--teal-tint)"}}>
      <div className="row between" style={{marginBottom:12}}>
        <h3>Add a new need</h3>
        <button className="btn ghost sm" onClick={onCancel}><Icon name="x" size={14}/></button>
      </div>
      <div className="formGrid">
        ...same fields...
      </div>
      <div className="row" style={{justifyContent:"flex-end", gap:8, marginTop:6}}>
        <button className="btn ghost" onClick={onCancel}>Cancel</button>
        <button className="btn teal" disabled={!item || !needed} onClick={() => onAdd(...)}>
          <Icon name="check" size={14}/> Add need
        </button>
      </div>
    </div>
  );
}
```
Create `EditNeedForm({ need, onSave, onCancel })` — same structure, pre-populate fields from `need`, change button label to "Save changes".

**Edit state pattern** (NeedsBoard lines 214–217):
```jsx
const [needs, setNeeds] = useState(INITIAL_NEEDS);
const [adding, setAdding] = useState(false);
const [filter, setFilter] = useState("all");
// Add:
const [editingId, setEditingId] = useState(null);
```

**Inline form insertion pattern** (NeedsBoard lines 250–254):
```jsx
{adding && (
  <div style={{marginBottom:18}}>
    <AddNeedForm onAdd={(n) => { setNeeds([{ id: Date.now(), ...n }, ...needs]); setAdding(false); }} onCancel={() => setAdding(false)} />
  </div>
)}
```
Copy same pattern: when `editingId === n.id`, render `<EditNeedForm>` replacing the table row OR inline above the table.

---

### `src/AdminApp.jsx` — `DonationHistory` search/filter/export wiring (lines 360–422)

**Analog:** `src/DonorApp.jsx` — `DonorBrowse` useMemo filter pattern (lines 197–245)

**useMemo filter pattern to copy** (DonorBrowse lines 200–211):
```jsx
const filtered = useMemo(() => {
  let list = HOMES;
  if (filter === "urgent") list = list.filter(h => h.urgency === "urgent");
  if (q.trim()) {
    const s = q.toLowerCase();
    list = list.filter(h => h.name.toLowerCase().includes(s) || h.area.toLowerCase().includes(s));
  }
  return list;
}, [filter, q]);
```
Apply same pattern to `HISTORY`:
```jsx
const [q, setQ] = useState("");
const [dateFrom, setDateFrom] = useState("");
const filtered = useMemo(() => {
  let list = HISTORY;
  if (q.trim()) {
    const s = q.toLowerCase();
    list = list.filter(h => h.donor.toLowerCase().includes(s) || h.item.toLowerCase().includes(s));
  }
  if (dateFrom) list = list.filter(h => h.date >= dateFrom);
  return list;
}, [q, dateFrom]);
```

**Search input pattern** (DonorBrowse lines 228–231):
```jsx
<div className="searchWrap">
  <span className="ico"><Icon name="search" size={16}/></span>
  <input placeholder="Search by area or home name…" value={q} onChange={e => setQ(e.target.value)} />
</div>
```

**Export CSV: standard Blob + anchor pattern** (no codebase analog; use RESEARCH.md pattern):
```jsx
const exportCSV = () => {
  const headers = ["Donor","Item","Qty","Date","Confirmed by"];
  const rows = filtered.map(r => [r.donor, r.item, r.qty, r.date, r.confirmedBy]);
  const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "donation-history.csv"; a.click();
  URL.revokeObjectURL(url);
};
```

---

### `src/index.css` — `.empty` class extension (line 885)

**Analog:** `src/index.css` — existing `.empty` (line 885) + `.badge .dot` sub-element pattern (lines 396–398)

**Current `.empty` to extend** (index.css lines 885–889):
```css
.empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--ink-3);
}
```

**Sub-element pattern to follow** (`.badge .dot` at lines 396–398):
```css
.badge .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: currentColor;
}
```

**New CSS sub-classes to add immediately after line 889:**
```css
.empty .icon { font-size: 32px; margin-bottom: 12px; opacity: 0.5; }
.empty .title {
  font-family: var(--serif);
  font-size: 18px;
  color: var(--ink);
  font-weight: 500;
  margin-bottom: 6px;
}
.empty .sub { font-size: 13px; color: var(--ink-3); margin-bottom: 18px; line-height: 1.5; }
```

**Existing call sites to update** — all currently use plain string children:
- `DonorApp.jsx` line 631: `<div className="empty">No pledges in this tab yet.</div>`
- `DonorApp.jsx` line 243: `<div className="empty">No homes match that filter.</div>`
- `AdminApp.jsx` line 351: `<div className="empty">Nothing in this tab.</div>`

**JSX pattern for all updated call sites:**
```jsx
<div className="empty">
  <div className="icon">🌱</div>
  <div className="title">[Context-specific title]</div>
  <div className="sub">[Context-specific subtitle]</div>
  <button className="btn teal sm" onClick={() => go("[target]")}>[CTA label]</button>
</div>
```

**CTA button class to use** (index.css lines 360, 367):
```css
.btn.teal { background: var(--teal); border-color: var(--teal); }
.btn.sm { padding: 7px 12px; font-size: 12px; border-radius: 7px; }
```

---

### `src/data.js` — `"Ordered"` status addition

**Analog:** `src/DonorApp.jsx` — `MY_PLEDGES_SEED` (lines 558–566) and `StatusBadge` map (lines 65–72)

**StatusBadge map to extend** (DonorApp.jsx lines 66–71):
```jsx
const map = {
  "Pledged": "pledged", "Delivered": "delivered", "Confirmed": "confirmed",
  "Missed": "missed", "Overdue": "overdue",
  "Urgent": "urgent", "Moderate": "moderate", "Covered": "covered", "Partial": "partial",
};
// Add: "Ordered": "pledged"  (reuse teal-light tone — between pledged and delivered)
```

**MY_PLEDGES_SEED pattern to copy for new "Ordered" seed row** (DonorApp.jsx lines 558–566):
```jsx
{ id:1, home:"Shanti Niketan Home", area:"Andheri West", item:"Atta", qty:"5 kg",
  unit:"kg", method:"Drop off", pledgeDate:"8 May 2026", dropDate:"12 May 2026",
  status:"Pledged" },
// Add one row with status:"Ordered" to demonstrate the new state in My Pledges tab
```

---

## Shared Patterns

### State Management (all components)
**Source:** `src/DonorApp.jsx` lines 786–789 + `src/AdminApp.jsx` line 508
**Apply to:** Every modified component
```jsx
// Single useState per local concern — no Context, no Redux
const [active, setActive] = useState("home");
const [selectedHome, setSelectedHome] = useState(null);
```

### Async Loading State Pattern
**Source:** `src/AdminApp.jsx` — `HomeProfileEdit` saved-state (lines 425, 450–454)
**Apply to:** PledgeForm Swiggy MCP call, HomeProfileEdit copy-link
```jsx
const [saved, setSaved] = useState(false);
// Trigger:
onClick={() => setSaved(true)}
// Render:
{saved && <div className="card fadeIn" style={{...}}>...</div>}
```

### Conditional Empty State
**Source:** `src/AdminApp.jsx` — `IncomingPledges` (lines 350–352)
**Apply to:** Every list/table that can have zero items
```jsx
{filtered.length === 0 && (
  <tr><td colSpan={7}><div className="empty">Nothing in this tab.</div></td></tr>
)}
```

### Navigation / Screen Switching
**Source:** `src/DonorApp.jsx` lines 786–789 + all `go(key)` usages
**Apply to:** Any CTA that navigates to another screen (empty state CTAs)
```jsx
// DonorApp passes go = setActive
// Usage in components:
<button className="btn teal sm" onClick={() => go("browse")}>Browse homes</button>
```

### Token Usage (no hard-coded values)
**Source:** `src/index.css` lines 1–39
**Apply to:** Every new inline style added
```jsx
// Correct:
style={{ color: "var(--teal-dark)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}
// Wrong:
style={{ color: "#0F6E56", borderRadius: "12px" }}
```

### Icon Usage
**Source:** `src/Icon.jsx` lines 1–39
**Apply to:** Every new button or decorative icon
```jsx
<Icon name="copy" size={14}/>   // copy, check, x, plus, edit, search, arrow already exist
// For new icons (share, qr): add case to Icon.jsx switch block using same SVG props spread
```

### fadeIn animation class
**Source:** Used throughout both files — `className="fadeIn"` on every top-level screen div
**Apply to:** Any new card or section that appears conditionally
```jsx
<div className="card fadeIn" style={{...}}>
```

---

## No Analog Found

All files in this phase have analogs in the codebase. The following sub-patterns have no direct codebase equivalent and must use RESEARCH.md patterns:

| Pattern | Reason | RESEARCH.md Reference |
|---------|---------|----------------------|
| Swiggy MCP `fetch` wrapper (`callSwiggyMCP`) | No external API calls exist in the codebase today | RESEARCH.md Pattern 4 (lines 295–342) |
| CSV Blob download (`exportCSV`) | No file export exists in codebase | RESEARCH.md Code Examples (lines 508–519) |
| `navigator.clipboard.writeText` copy feedback | No clipboard usage exists in codebase | RESEARCH.md Code Examples (lines 488–504) |
| Impact card teal gradient layout | No gradient cards exist in codebase | RESEARCH.md Pattern 5 (lines 350–391) |

---

## Metadata

**Analog search scope:** `src/DonorApp.jsx`, `src/AdminApp.jsx`, `src/index.css`, `src/Icon.jsx`, `src/data.js`
**Files scanned:** 5
**Pattern extraction date:** 2026-05-24
