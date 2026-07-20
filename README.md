# BillingApp

A billing and invoice management system for small businesses — quotations, proforma invoices, and tax invoices with GST support, built with a Go REST API, PostgreSQL, and a React + TypeScript frontend.

## Overview

BillingApp handles the full document lifecycle for a business — client management, quotations that convert into proforma invoices, and proforma invoices that convert into tax invoices — backed by a single unified document schema instead of separate tables per document type. GST is computed correctly for both intra-state (CGST/SGST) and inter-state (IGST) transactions, and each document type gets its own sequential numbering per fiscal year.

## Features

- **Architecture** — service, repository, and handler layers following clean backend design principles
- **Auth** — JWT-based login and session handling
- **Company profiles** — store business details used across generated documents
- **Client management** — create, update, delete, search, and paginate clients
- **Documents** — quotations, proforma invoices, and tax invoices, with duplication and document-to-document conversion (quotation → proforma → tax invoice) via `source_document_id`
- **GST engine** — automatic IGST or CGST/SGST split based on client location
- **Sequential numbering** — per-document-type, per-fiscal-year invoice numbers
- **Payments** — record payments against invoices and track status
- **Frontend** — React document editor that mirrors the final PDF layout, with live totals in Indian numbering format and print-ready PDF export

## Tech Stack

| Layer    | Technology                      |
| -------- | ------------------------------- |
| Backend  | Go, Fiber                       |
| Database | PostgreSQL, pgx                 |
| Auth     | JWT                             |
| Frontend | React, TypeScript, Vite         |
| Tooling  | Postman, Git, Docker (optional) |

## Project Structure

```text
BillingApp/
├── backend/
│   ├── cmd/server/
│   ├── configs/
│   ├── database/migrations/
│   ├── handlers/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── utils/
└── frontend/
    └── ...              # React app: document editor & PDF generation
```

## Database Schema

Documents share one unified table rather than separate tables per type:

- **`users`** — accounts and auth
- **`company_details`** — business profile used on generated documents
- **`clients`** — customer records
- **`documents`** — quotations, proforma invoices, and tax invoices in one table, keyed by a `doc_type` enum; `source_document_id` self-references the document a given one was converted from
- **`document_items`** — line items per document
- **`document_sequences`** — tracks the next sequence number per `doc_type` per fiscal year
- **`payments`** — payments recorded against documents

## API Modules

**Auth**

- Login
- Fetch user profile

**Company**

- Create / update / fetch company details

**Clients**

- Create / update / delete / fetch (with search & pagination)

**Documents**

- Create quotation / proforma invoice / tax invoice
- Update, delete, duplicate
- Convert one document type into another (e.g. quotation → proforma)

**Payments**

- Record payment
- Update payment status
- Fetch payment history

## Getting Started

### Prerequisites

- Go 1.22+
- PostgreSQL 16+
- Node.js 18+ (for the frontend)
- `migrate` CLI (or your preferred migration tool)

### Backend setup

```bash
git clone https://github.com/GlitchOfTheMatrix/BillingApp.git
cd BillingApp/backend
go mod tidy
```

Create a `.env` file in `backend/`:

```env
PORT=8080
DATABASE_URL=postgres://username:password@localhost:5432/billing_db
JWT_SECRET=your_secret_key
```

Run migrations and start the server:

```bash
migrate -path database/migrations -database "$DATABASE_URL" up
go run cmd/server/main.go
```

The API runs at `http://localhost:8080`.

### Frontend setup

```bash
cd BillingApp/frontend
npm install
npm run dev
```

## Roadmap

- [ ] Server-side PDF generation
- [ ] Email integration for sending documents to clients
- [ ] Dashboard analytics
- [ ] Role-based permissions
- [ ] Docker Compose / Kubernetes deployment
- [ ] Unit and integration test coverage

## License

MIT
