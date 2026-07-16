# BillingApp Backend

A Go-based REST API backend for a billing and invoicing application. Built with **Fiber** (web framework), **PostgreSQL** (database), and **JWT** (authentication).

## Tech Stack

| Technology                                                            | Purpose                             |
| --------------------------------------------------------------------- | ----------------------------------- |
| [Go](https://go.dev/)                                                 | Backend language                    |
| [Fiber v2](https://gofiber.io/)                                       | HTTP web framework                  |
| [PostgreSQL](https://www.postgresql.org/)                             | Relational database                 |
| [pgx v5](https://github.com/jackc/pgx)                                | PostgreSQL driver & connection pool |
| [golang-jwt v5](https://github.com/golang-jwt/jwt)                    | JWT authentication                  |
| [bcrypt](https://pkg.go.dev/golang.org/x/crypto/bcrypt)               | Password hashing                    |
| [go-playground/validator](https://github.com/go-playground/validator) | Request validation                  |
| [shopspring/decimal](https://github.com/shopspring/decimal)           | Precise decimal arithmetic          |
| [maroto v2](https://github.com/johnfercher/maroto)                    | PDF invoice generation              |

## Project Structure

```
backend/
├── cmd/server/          # Application entry point
│   └── main.go
├── configs/             # Configuration loading
│   └── config.go
├── database/            # Database connection & migrations
│   ├── postgres.go
│   └── migrations/      # SQL migration files
├── handlers/            # HTTP request handlers
│   ├── user_handler.go
│   ├── client_handler.go
│   ├── document_handler.go
│   ├── document_item_handler.go
│   ├── payment_handler.go
│   └── company_details_handler.go
├── middleware/           # Auth & role middleware
│   └── auth.go
├── models/              # Data models & DTOs
│   ├── user.go
│   ├── authDTO.go
│   ├── client.go
│   ├── document.go
│   ├── document_item.go
│   ├── payment.go
│   └── company_details.go
├── repositories/        # Database access layer
│   ├── user_repository.go
│   ├── client_repository.go
│   ├── document_repository.go
│   ├── document_item_repository.go
│   ├── payment_repository.go
│   └── company_details_repository.go
├── routes/              # Route definitions
│   └── routes.go
├── services/            # Business logic layer
│   ├── user_service.go
│   ├── client_service.go
│   ├── document_service.go
│   ├── document_item_service.go
│   ├── payment_service.go
│   ├── company_details_service.go
│   └── pdf_service.go
├── utils/               # Shared utilities
│   ├── jwt.go
│   ├── pagination.go
│   └── validator.go
├── .env                 # Environment variables
├── go.mod
└── go.sum
```

## Architecture

The application follows a **layered architecture**:

```
Request → Routes → Middleware → Handler → Service → Repository → Database
```

- **Handlers** — Parse HTTP requests, validate input, return responses.
- **Services** — Business logic, password hashing, token generation.
- **Repositories** — Raw SQL queries via pgx, direct database access.

## Getting Started

### Prerequisites

- **Go 1.26+**
- **PostgreSQL 14+**
- [golang-migrate](https://github.com/golang-migrate/migrate) (for running migrations)

### 1. Clone the repository

```bash
git clone https://github.com/GlitchOfTheMatrix/BillingApp.git
cd BillingApp/backend
```

### 2. Configure environment

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgres://username:password@localhost:5432/billingapp?sslmode=disable
PORT=8080
JWT_SECRET=your-secret-key-here
```

### 3. Create the database

```bash
createdb billingapp
```

### 4. Run migrations

```bash
migrate -path database/migrations -database "postgres://username:password@localhost:5432/billingapp?sslmode=disable" up
```

### 5. Install dependencies

```bash
go mod download
```

### 6. Run the server

```bash
go run cmd/server/main.go
```

The server will start on `http://localhost:8080`.

## API Endpoints

### Authentication

| Method | Endpoint                    | Description                   | Auth |
| ------ | --------------------------- | ----------------------------- | ---- |
| `POST` | `/api/auth/register`        | Register a new user           | No   |
| `POST` | `/api/auth/login`           | Login & get tokens            | No   |
| `POST` | `/api/auth/refresh`         | Refresh access token          | No   |
| `POST` | `/api/auth/forgot-password` | Generate password reset token | No   |
| `POST` | `/api/auth/reset-password`  | Reset password with token     | No   |
| `POST` | `/api/auth/change-password` | Change password (logged in)   | Yes  |

### Clients

| Method   | Endpoint           | Description                  | Auth |
| -------- | ------------------ | ---------------------------- | ---- |
| `POST`   | `/api/clients/`    | Create a client              | Yes  |
| `GET`    | `/api/clients/`    | List all clients (paginated) | Yes  |
| `GET`    | `/api/clients/:id` | Get client by ID             | Yes  |
| `PUT`    | `/api/clients/:id` | Update a client              | Yes  |
| `DELETE` | `/api/clients/:id` | Delete a client              | Yes  |

### Documents (Invoices, Quotations, Proformas)

| Method   | Endpoint                       | Description                     | Auth |
| -------- | ------------------------------ | ------------------------------- | ---- |
| `POST`   | `/api/documents/`              | Create a document with items    | Yes  |
| `GET`    | `/api/documents/`              | List all documents (paginated)  | Yes  |
| `GET`    | `/api/documents/:id`           | Get document by ID (with items) | Yes  |
| `PUT`    | `/api/documents/:id`           | Update document and items       | Yes  |
| `DELETE` | `/api/documents/:id`           | Delete a document               | Yes  |
| `POST`   | `/api/documents/:id/duplicate` | Duplicate a document            | Yes  |
| `GET`    | `/api/documents/:id/pdf`       | Download document as PDF        | Yes  |

### Payments

| Method   | Endpoint            | Description                   | Auth |
| -------- | ------------------- | ----------------------------- | ---- |
| `POST`   | `/api/payments/`    | Record a payment              | Yes  |
| `GET`    | `/api/payments/`    | List all payments (paginated) | Yes  |
| `GET`    | `/api/payments/:id` | Get payment by ID             | Yes  |
| `PUT`    | `/api/payments/:id` | Update a payment              | Yes  |
| `DELETE` | `/api/payments/:id` | Delete a payment              | Yes  |

### Company Details

| Method   | Endpoint                   | Description              | Auth |
| -------- | -------------------------- | ------------------------ | ---- |
| `POST`   | `/api/company-details/`    | Create company details   | Yes  |
| `GET`    | `/api/company-details/`    | List all company details | Yes  |
| `GET`    | `/api/company-details/:id` | Get company by ID        | Yes  |
| `PUT`    | `/api/company-details/:id` | Update company details   | Yes  |
| `DELETE` | `/api/company-details/:id` | Delete company details   | Yes  |

### Users (Admin only)

| Method   | Endpoint         | Description                | Auth  |
| -------- | ---------------- | -------------------------- | ----- |
| `GET`    | `/api/users/`    | List all users (paginated) | Admin |
| `GET`    | `/api/users/:id` | Get user by ID             | Admin |
| `PUT`    | `/api/users/:id` | Update user                | Admin |
| `DELETE` | `/api/users/:id` | Delete user                | Admin |

## Authentication

The API uses **JWT Bearer tokens**:

- **Access Token** — Expires in 15 minutes. Used for all authenticated requests.
- **Refresh Token** — Expires in 7 days. Used to obtain new access tokens.

Include the access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Pagination & Search

All list endpoints support pagination and search via query parameters:

| Parameter | Default | Description                                   |
| --------- | ------- | --------------------------------------------- |
| `page`    | `1`     | Page number                                   |
| `limit`   | `10`    | Items per page (max 100)                      |
| `search`  | `""`    | Search term (searches across relevant fields) |

**Example:**

```
GET /api/clients/?page=2&limit=20&search=acme
```

**Response format:**

```json
{
  "data": [...],
  "total": 50,
  "page": 2,
  "limit": 20,
  "total_pages": 3
}
```

## Document Types

| Type             | Value         |
| ---------------- | ------------- |
| Quotation        | `quotation`   |
| Proforma Invoice | `proforma`    |
| Tax Invoice      | `tax_invoice` |

## Document Statuses

| Status    | Value       |
| --------- | ----------- |
| Draft     | `draft`     |
| Sent      | `sent`      |
| Accepted  | `accepted`  |
| Paid      | `paid`      |
| Cancelled | `cancelled` |
