package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type DocumentItem struct {
	ID uuid.UUID `db:"id"`

	DocumentID uuid.UUID `db:"document_id"`

	SerialNo int `db:"serial_no"`

	SoftwareName string `db:"software_name"`

	Description string `db:"description"`

	HSNCode string `db:"hsn_code"`

	LicenseType string `db:"license_type"`

	SubscriptionDuration string `db:"subscription_duration"`

	Quantity int `db:"quantity"`

	Unit string `db:"unit"`

	Rate decimal.Decimal `db:"rate"`

	Discount decimal.Decimal `db:"discount"`

	TaxRate decimal.Decimal `db:"tax_rate"`

	Total decimal.Decimal `db:"total"`

	Extra json.RawMessage `db:"extra"`

	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}
