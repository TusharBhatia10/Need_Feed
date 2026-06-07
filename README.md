# Need Feed — Connecting Donors to Verified Causes

Need Feed is a premium, verified-cause support application designed to directly connect donors with real-world local organizations (Eldercare, Child Welfare, and Animal Welfare) to fund daily-use groceries and hot meals on the fly. 

Built using modern vanilla HTML, CSS, and JavaScript, Need Feed simulates a live, automated procurement pipeline integrated with Swiggy Instamart and Swiggy Food APIs to track deliveries from transit to doorstep.

---

## Key Features

### 1. Swiggy MCP Flow & JSON-RPC Simulator
- **MCP Playground**: Interactive terminal and flowchart console representing how AI agents communicate with Swiggy catalog, cart, and checkout tool endpoints using the Model Context Protocol.
- **Real-Time Logs**: Features a dark developer console logging JSON-RPC request-response transactions step-by-step.

### 2. Verified Cause Categories & Filters
Browse shelters and organizations dynamically filtered by category tabs (completely emoji-free):
- **Eldercare**: Scraped real registered facilities in Mumbai (The Banyan Tree Geriatric Care, C.U. Shah Senior Citizens Home, Adharwad Old Age Home, and Dhanwantari Old Age Home).
- **Child Welfare**: Orphanages and support shelters (Bal Asha Trust, Aasara Bombay).
- **Animal Welfare**: Stray shelters and animal hospitals (Bombay SPCA & Animal Hospital, Animal Matters To Me).

### 3. LHS Collapsible Supporter Sidebar
- **Supporter Profile**: Focuses on a single-user interactive session (preset to Tushar Bhatia).
- **Collapsible Design**: A collapsible side panel that collapses from 340px down to a compact 80px layout for maximized screen real estate.
- **Supporter Statistics**: Real-time counters showing total donated value and pledge count, which automatically increment as donations are processed.

### 4. Dynamic Donation History & Detail Modal
- **Dynamic Startup State**: The donation history list begins completely empty on page load.
- **Detailed Modal Dialogs**: Clicking on any logged pledge opens a centered detail popup modal showing:
  - Donated items count and unit specifications (pre-filled to Tushar Bhatia with custom weight/volume units).
  - Receipt price breakdowns (subtotal, Swiggy delivery fee, GST taxes).
  - Target beneficiary details with clickable links to their official websites.
  - A real-time delivery status tracker (Placed -> In Transit -> Delivered).

### 5. Expandable Supplies Drawer
- Supports a widescreen modal toggle ("Expand Window" button) to expand the supplies drawer to 90vw / 90vh layout for optimal visibility on desktop screens.

### 6. Shelter Admin Portal
- **Modal Need Creator**: Moves the posting form from the sidebar to an overlay modal dialog triggered by the "+ Add Need" header button.
- **Metrics Dashboard**: Refactored Active Needs columns to show weight/size alongside quantity, track requested vs. delivered units, and update progress based on actual deliveries.

### 7. Page Reload Reset
To facilitate clean interactive demos, page reloads do not persist changes. A refresh instantly resets the database and user pledges back to standard initial seed values.

---

## 🚀 Installation & Running the App Locally

### 1. Installation & Setup
Clone the repository, enter the directory, and ensure you are on the correct development branch:

```bash
# Clone the repository
git clone https://github.com/TusharBhatia10/Need_Feed.git

# Navigate into the project folder
cd Need_Feed

# Switch to the active development branch
git checkout tushar_gemini_v1
```

### 2. Running Locally
Need Feed is built purely on vanilla web technologies (HTML, CSS, JS) and does not require complex backend installs or dependencies. To start, run any local HTTP server in the project root:

#### Using Python
```bash
python3 -m http.server 3000
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

#### Using Node.js (npx)
```bash
npx serve .
```

---

## 🛠️ Codebase Structure

- [index.html](file:///Users/tusharbhatia/.gemini/antigravity/worktrees/Need_feed_Gemini/build-github-repo-app/index.html) - Core layout, views switching (Donor Feed vs. Shelter Admin Portal), popup drawers, and modals.
- [style.css](file:///Users/tusharbhatia/.gemini/antigravity/worktrees/Need_feed_Gemini/build-github-repo-app/style.css) - Custom design system based on a modern mint-emerald HSL palette, CSS Grid Area placements, responsive media queries, and transition animations.
- [app.js](file:///Users/tusharbhatia/.gemini/antigravity/worktrees/Need_feed_Gemini/build-github-repo-app/app.js) - Mock database models (`SHELTERS_DB` & `PLEDGES_QUEUE`), Swiggy MCP JSON-RPC simulated router, delivery transit tickers, and sidebar visual rendering.
