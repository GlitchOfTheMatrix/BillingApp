package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID uuid.UUID `db:"id" json:"id"`

	Name string `db:"name" json:"name" validate:"required,min=2,max=100"`

	Email string `db:"email" json:"email" validate:"required,email"`

	PasswordHash string `db:"password_hash" json:"-"`

	Role string `db:"role" json:"role" validate:"required"`

	ResetToken *string `db:"reset_token" json:"-"`

	ResetTokenExpires *time.Time `db:"reset_token_expires" json:"-"`

	CreatedAt time.Time `db:"created_at" json:"created_at"`

	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}
