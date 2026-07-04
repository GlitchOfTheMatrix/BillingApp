package models

import (
	"time"

	"github.com/google/uuid"
)

type CompanyDetails struct {
	ID uuid.UUID `db:"id"`

	CompanyName string `db:"company_name"`

	GSTNumber  string `db:"gst_number"`
	PANNumber  string `db:"pan_number"`
	MSMENumber string `db:"msme_number"`

	Address string `db:"address"`

	Phone string `db:"phone"`

	Email string `db:"email"`

	Website string `db:"website"`

	BankName string `db:"bank_name"`

	AccountNumber string `db:"account_number"`

	IFSCCode string `db:"ifsc_code"`

	Branch string `db:"branch"`

	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}
