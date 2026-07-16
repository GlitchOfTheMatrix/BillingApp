package models

import (
	"time"

	"github.com/google/uuid"
)

type Client struct {
	ID uuid.UUID `db:"id" json:"id"`

	Name         string `db:"name" json:"name" validate:"required,min=2,max=100"`
	Organisation string `db:"organisation" json:"organisation"`

	Address string `db:"address" json:"address"`
	City    string `db:"city" json:"city"`
	State   string `db:"state" json:"state"`
	Country string `db:"country" json:"country"`

	GSTNumber string `db:"gst_number" json:"gst_number"`

	Email string `db:"email" json:"email" validate:"omitempty,email"`
	Phone string `db:"phone" json:"phone"`

	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}
