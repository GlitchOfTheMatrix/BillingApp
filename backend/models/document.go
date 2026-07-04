package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type DocumentType string

const (
	DocumentTypeQuotation DocumentType = "quotation"
	DocumentTypeProforma  DocumentType = "proforma"
	DocumentTypeInvoice   DocumentType = "tax_invoice"
)

type DocumentStatus string

const (
	DocumentStatusDraft     DocumentStatus = "draft"
	DocumentStatusSent      DocumentStatus = "sent"
	DocumentStatusAccepted  DocumentStatus = "accepted"
	DocumentStatusPaid      DocumentStatus = "paid"
	DocumentStatusCancelled DocumentStatus = "cancelled"
)

type Document struct {
	ID uuid.UUID `db:"id"`

	DocumentType DocumentType `db:"document_type"`

	DocumentNumber string `db:"document_number"`

	DocumentDate time.Time `db:"document_date"`

	ClientID uuid.UUID `db:"client_id"`

	SourceDocumentID *uuid.UUID `db:"source_document_id"`

	OrderNumber string     `db:"order_number"`
	OrderDate   *time.Time `db:"order_date"`

	Status DocumentStatus `db:"status"`

	Subtotal decimal.Decimal `db:"subtotal"`
	Shipping decimal.Decimal `db:"shipping"`
	Discount decimal.Decimal `db:"discount"`

	CGST decimal.Decimal `db:"cgst"`
	SGST decimal.Decimal `db:"sgst"`
	IGST decimal.Decimal `db:"igst"`

	GrandTotal decimal.Decimal `db:"grand_total"`

	AmountInWords string `db:"amount_in_words"`

	Remarks string `db:"remarks"`

	CreatedBy uuid.UUID `db:"created_by"`

	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`

	// Relations
	Client *Client        `db:"-"`
	Items  []DocumentItem `db:"-"`
}
