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
	ID uuid.UUID `db:"id" json:"id"`

	DocumentType DocumentType `db:"document_type" json:"document_type"`

	DocumentNumber string `db:"document_number" json:"document_number"`

	DocumentDate time.Time `db:"document_date" json:"document_date"`

	ClientID uuid.UUID `db:"client_id" json:"client_id"`

	SourceDocumentID *uuid.UUID `db:"source_document_id" json:"source_document_id"`

	OrderNumber string `db:"order_number" json:"order_number"`

	OrderDate *time.Time `db:"order_date" json:"order_date"`

	Status DocumentStatus `db:"status" json:"status"`

	Subtotal decimal.Decimal `db:"subtotal" json:"subtotal"`

	Shipping decimal.Decimal `db:"shipping" json:"shipping"`

	Discount decimal.Decimal `db:"discount" json:"discount"`

	CGST decimal.Decimal `db:"cgst" json:"cgst"`

	SGST decimal.Decimal `db:"sgst" json:"sgst"`

	IGST decimal.Decimal `db:"igst" json:"igst"`

	GrandTotal decimal.Decimal `db:"grand_total" json:"grand_total"`

	AmountInWords string `db:"amount_in_words" json:"amount_in_words"`

	Remarks string `db:"remarks" json:"remarks"`

	CreatedBy uuid.UUID `db:"created_by" json:"created_by"`

	CreatedAt time.Time `db:"created_at" json:"created_at"`

	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`

	// Relations
	Client *Client `db:"-" json:"client,omitempty"`

	Items []DocumentItem `db:"-" json:"items"`
}
