# Brightloop — Subscription Management Website (Rebuild)

A rebuild of https://manashpandey.lovable.app made with **React + Vite**.

## 1. What the original site is (analysis)

**Brightloop** is a "subscription operating system" — a SaaS for businesses that sell recurring plans.

| Part | What it does |
|---|---|
| Landing page | Hero ("Revenue that loops itself"), Today vs With Brightloop, 9 features, lifecycle, roles, pricing, FAQ, final call-to-action |
| Auth page (`/auth?mode=login` / `signup`) | Sign up / log in. The **first account becomes admin** |
| App (behind login) | Products & variants, plans (daily/weekly/monthly/yearly), subscriptions, invoices with tax & discounts, payments, MRR/ARR reports |
| Roles | Admin (everything), Staff (customers, quotes, invoices, payments), Customer (own portal) |
| Lifecycle | Draft → Quotation → Confirmed → Active → Closed (plus pause / resume / cancel / renew) |
| Design | Dark navy background, teal-green gradient accent, gold numbers, grid pattern, rounded cards, Sora + Manrope fonts |

The original uses a real database. This rebuild saves data **in the browser (localStorage)** so it runs with zero setup.
Pricing amounts and FAQ answers were hidden on the original, so sample values are used in `src/data.js`.

## 2. Folder structure

```
brightloop/
├── index.html            ← page shell + fonts
├── package.json          ← dependencies & scripts
├── vite.config.js        ← Vite config
└── src/
    ├── main.jsx          ← app entry + routes (/, /auth, /dashboard)
    ├── styles.css        ← all colors, layout, design
    ├── data.js           ← all text: features, plans, FAQ...
    ├── store.js          ← login/signup + saving data in the browser
    ├── assets/hero.jpg   ← hero image
    └── pages/
        ├── Landing.jsx   ← home page
        ├── Auth.jsx      ← login / signup
        ├── Dashboard.jsx ← subscriptions, MRR, ARR, collected, outstanding
        ├── Products.jsx  ← products with sales/cost price and tax %
        ├── Invoices.jsx  ← "Run billing" creates invoices (tax added, duplicates blocked)
        └── Payments.jsx  ← record cash/bank/card payments against invoices
    └── components/Layout.jsx ← top bar with page tabs + login check
```

## 3. Step-by-step in VS Code

### Step 1 — Install tools (one time)
1. Install **Node.js LTS** from https://nodejs.org (includes npm).
2. Install **VS Code** from https://code.visualstudio.com.
3. Check in a terminal: `node -v` and `npm -v` should print versions.

### Step 2 — Open the project
1. Unzip `brightloop.zip`.
2. VS Code → **File → Open Folder…** → select the `brightloop` folder.
3. Open the terminal: **View → Terminal** (or `` Ctrl+` ``).

### Step 3 — Install packages
```bash
npm install
```

### Step 4 — Run it
```bash
npm run dev
```
Open http://localhost:5173 in your browser. Edits save and reload instantly.

### Step 5 — Try it
1. Click **Get started** → sign up (password: 8+ chars, upper, lower, number, symbol, e.g. `Admin@123`).
2. The first account becomes **admin** and lands on the dashboard.
3. **Products** tab → add a product (e.g. Odoo Plan, ₹1000, tax 18%).
4. **Subscriptions** tab → add a subscription using that product → MRR / ARR update.
5. **Invoices** tab → click **Run billing** → an invoice with tax is created. Click again: it is skipped (no duplicates in the same period).
6. **Payments** tab → pick the invoice, record part of the amount → invoice shows *partial*; pay the rest → *paid*.
7. Dashboard shows Collected vs Outstanding.

### Step 6 — Customize
- Text, features, prices, FAQ → `src/data.js`
- Colors → top of `src/styles.css` (`--primary`, `--gold`, `--bg`)
- Hero image → replace `src/assets/hero.jpg`

### Step 7 — Build for hosting
```bash
npm run build
```
Upload the `dist/` folder to Netlify, Vercel or any static host.

## 4. Next steps to match the full original
Done: products, invoices (run billing, tax, no duplicates), payments, collected/outstanding.
Still to do:
1. Real database + login (e.g. Supabase or Firebase) instead of `store.js`.
2. Product variants, discount rules, quotations.
3. Restrict pages by role (admin / staff / customer portal).

Recommended VS Code extensions: ES7+ React snippets, Prettier, ESLint.
