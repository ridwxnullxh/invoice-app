# Invoice App

A fully functional invoice management application built with **React 19**, **React Router v7**, and **Tailwind CSS v4**.

---

## Live Demo

> Deploy to Vercel: `vercel --prod` (connect GitHub repo first)

---

## Setup Instructions

```bash
# Clone and install
git clone <your-repo-url>
cd invoice-app
npm install

# Start development server
npm run dev

# Production build
npm run build
npm start
```

Requires **Node 18+**.

---

## Features

| Feature | Implementation |
|---|---|
| Create invoices | Form drawer with full validation |
| View invoices | Detail page with all fields |
| Update invoices | Pre-filled edit drawer |
| Delete invoices | Confirmation modal |
| Save as Draft | Skips validation, saves immediately |
| Mark as Paid | Status transition: Pending → Paid |
| Filter by status | Checkbox multi-select dropdown |
| Light / Dark mode | Toggles `<html class="dark">`, persists to localStorage |
| Responsive design | Mobile-first, adapts at `md` (768px) breakpoint |
| Data persistence | localStorage (survives page reload) |
| Form validation | Per-field with inline error messages |
| Accessibility | Focus trap, ESC key, ARIA roles, semantic HTML |

---

## Architecture

```
app/
├── context/
│   ├── ThemeContext.jsx      Dark mode state + localStorage
│   └── InvoiceContext.jsx    Invoices CRUD state + localStorage
├── components/
│   ├── Layout.jsx            Desktop sidebar / mobile header
│   ├── StatusBadge.jsx       Paid / Pending / Draft badge
│   ├── InvoiceFormDrawer.jsx Create & edit form (side-panel/full-screen)
│   └── DeleteModal.jsx       Accessible confirmation modal
├── pages/
│   ├── InvoicesPage.jsx      Invoice list with filter
│   └── ViewInvoicePage.jsx   Invoice detail with actions
├── routes/
│   └── home.jsx              React Router v7 route entry
└── App.jsx                   Provider tree + page routing
```

### State Management

- **InvoiceContext** — holds the master invoice array. All CRUD mutations flow through it. Components consume it via `useInvoices()`.
- **ThemeContext** — holds `darkMode` boolean. Applies/removes `dark` class on `<html>`. Consumed by `Layout` via `useTheme()`.
- Both contexts read from **localStorage on first client mount** (inside `useEffect`) and write back on every state change, making them SSR-safe.

### Routing

React Router v7 (framework mode) with a single index route (`routes/home.jsx`). Page-level navigation (Invoices list ↔ Invoice detail) is handled with a simple `currentPage` state in `App.jsx` — no URL routing for inner pages, keeping the app self-contained.

---

## Status Flow

```
[Draft] ──edit & send──► [Pending] ──mark as paid──► [Paid]
   │                         │
   └── edit ──────────────── ┘
   └── delete ─────────────── ┘

[Paid] → read-only (no edit, delete, or status change)
```

---

## Form Validation

Validated on **Save & Send** (not on Save as Draft):

- All Bill From / Bill To address fields: required
- Client email: required + valid format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Invoice date, payment terms, project description: required
- Item list: at least 1 item required
- Each item: name required, qty ≥ 1, price ≥ 0

Errors display inline beneath each field, with red borders and `aria-invalid="true"` for screen readers. Re-validation runs live after the first failed submission attempt.

---

## Accessibility Notes

- **Semantic HTML**: `<header>`, `<aside>`, `<main>`, `<ul>/<li>` for invoice list, `<address>` for address blocks, `<fieldset>/<legend>` for form sections
- **Form labels**: every `<input>` and `<select>` has an associated `<label htmlFor>`
- **Modals**: `role="dialog"` / `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby`, **focus trap** (Tab/Shift+Tab cycles within), **ESC** closes
- **Invoice list**: `<ul aria-label="Invoice list">` with `<li>` + `<button>` for each item
- **Filter checkboxes**: `role="checkbox"`, `aria-checked`, keyboard-activatable via Space/Enter
- **Color contrast**: all text/background combinations pass WCAG AA (purple `#7C5DFA` on white, orange `#FF8F00` on light orange, teal on light teal)
- **No console errors** in production mode

---

## Trade-offs

| Decision | Rationale |
|---|---|
| localStorage (not IndexedDB) | Simpler API, sufficient for invoice data volume; no async complexity |
| Single-route SPA navigation | Avoids URL routing complexity for an assessment; real app would use proper routes |
| Tailwind CSS v4 (class-based dark) | `@variant dark (&:where(.dark, .dark *))` gives full control; avoids `prefers-color-scheme` conflicts |
| Seed data on first visit | Demonstrates the UI immediately without requiring manual data entry |
| SSR seed + client hydration | Avoids hydration mismatch: server renders seed data, client overwrites from localStorage in `useEffect` |

---

## Potential Improvements

- **URL-based routing** — each invoice detail at `/invoices/:id` for deep-linking and browser back button support
- **IndexedDB** — for larger datasets or file attachments
- **PDF export** — using `@react-pdf/renderer`
- **Search** — full-text search across client name, ID, and description
- **Due date calculation** — auto-compute due date from invoice date + payment terms
- **Email sending** — integrate with Resend / SendGrid API
- **Multi-currency** — beyond GBP (£)
