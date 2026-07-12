package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type DocumentItem struct {
	ID uuid.UUID `db:"id" json:"id"`

	DocumentID uuid.UUID `db:"document_id" json:"document_id"`

	SerialNo int `db:"serial_no" json:"serial_no"`

	SoftwareName string `db:"software_name" json:"software_name"`

	Description string `db:"description" json:"description"`

	HSNCode string `db:"hsn_code" json:"hsn_code"`

	LicenseType string `db:"license_type" json:"license_type"`

	SubscriptionDuration string `db:"subscription_duration" json:"subscription_duration"`

	Quantity int `db:"quantity" json:"quantity"`

	Unit string `db:"unit" json:"unit"`

	Rate decimal.Decimal `db:"rate" json:"rate"`

	Discount decimal.Decimal `db:"discount" json:"discount"`

	TaxRate decimal.Decimal `db:"tax_rate" json:"tax_rate"`

	Total decimal.Decimal `db:"total" json:"total"`

	Extra json.RawMessage `db:"extra" json:"extra"`

	CreatedAt time.Time `db:"created_at" json:"created_at"`

	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}
