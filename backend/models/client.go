package models

import (
	"time"

	"github.com/google/uuid"
)

type Client struct {
	ID uuid.UUID `db:"id"`

	Name         string `db:"name"`
	Organisation string `db:"organisation"`

	Address string `db:"address"`
	City    string `db:"city"`
	State   string `db:"state"`
	Country string `db:"country"`

	GSTNumber string `db:"gst_number"`

	Email string `db:"email"`
	Phone string `db:"phone"`

	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}
