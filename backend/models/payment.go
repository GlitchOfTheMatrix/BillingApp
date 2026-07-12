package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Payment struct {
	ID uuid.UUID `db:"id"`

	InvoiceID uuid.UUID `db:"invoice_id"`

	PaymentDate time.Time `db:"payment_date"`

	Amount decimal.Decimal `db:"amount"`

	Mode string `db:"mode"`

	UTRNumber string `db:"utr_number"`

	BankName string `db:"bank_name"`

	Status string `db:"status"`

	Remarks string `db:"remarks"`

	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}
