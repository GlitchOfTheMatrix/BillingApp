package models

import (
	"time"

	"github.com/google/uuid"
)

type CompanyDetails struct {
	ID uuid.UUID `db:"id" json:"id"`

	CompanyName string `db:"company_name" json:"company_name" validate:"required"`

	GSTNumber  string `db:"gst_number" json:"gst_number"`
	PANNumber  string `db:"pan_number" json:"pan_number"`
	MSMENumber string `db:"msme_number" json:"msme_number"`

	Address string `db:"address" json:"address"`

	Phone string `db:"phone" json:"phone"`

	Email string `db:"email" json:"email" validate:"omitempty,email"`

	Website string `db:"website" json:"website"`

	BankName string `db:"bank_name" json:"bank_name"`

	AccountNumber string `db:"account_number" json:"account_number"`

	IFSCCode string `db:"ifsc_code" json:"ifsc_code"`

	Branch string `db:"branch" json:"branch"`

	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}
