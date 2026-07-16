package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Payment struct {
	ID uuid.UUID `db:"id" json:"id"`

	InvoiceID uuid.UUID `db:"invoice_id" json:"invoice_id" validate:"required"`

	PaymentDate time.Time `db:"payment_date" json:"payment_date" validate:"required"`

	Amount decimal.Decimal `db:"amount" json:"amount"`

	Mode string `db:"mode" json:"mode" validate:"required"`

	UTRNumber string `db:"utr_number" json:"utr_number"`

	BankName string `db:"bank_name" json:"bank_name"`

	Status string `db:"status" json:"status" validate:"required"`

	Remarks string `db:"remarks" json:"remarks"`

	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}
