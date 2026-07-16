package repositories

import (
	"context"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/utils"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ClientRepository struct {
	db *pgxpool.Pool
}

func NewClientRepository(db *pgxpool.Pool) *ClientRepository {
	return &ClientRepository{
		db: db,
	}
}

func (r *ClientRepository) CreateClient(client *models.Client) error {
	query := `
		INSERT INTO clients (
			id,
			name,
			organisation,
			address,
			city,
			state,
			country,
			gst_number,
			email,
			phone
		)
		VALUES (
			$1,$2,$3,$4,$5,$6,$7,$8,$9,$10
		)
	`

	_, err := r.db.Exec(
		context.Background(),
		query,
		client.ID,
		client.Name,
		client.Organisation,
		client.Address,
		client.City,
		client.State,
		client.Country,
		client.GSTNumber,
		client.Email,
		client.Phone,
	)

	return err
}

func (r *ClientRepository) GetClientByID(id uuid.UUID) (*models.Client, error) {
	query := `
		SELECT
			id,
			name,
			organisation,
			address,
			city,
			state,
			country,
			gst_number,
			email,
			phone,
			created_at,
			updated_at
		FROM clients
		WHERE id = $1
	`

	var client models.Client

	err := r.db.QueryRow(
		context.Background(),
		query,
		id,
	).Scan(
		&client.ID,
		&client.Name,
		&client.Organisation,
		&client.Address,
		&client.City,
		&client.State,
		&client.Country,
		&client.GSTNumber,
		&client.Email,
		&client.Phone,
		&client.CreatedAt,
		&client.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &client, nil
}

func (r *ClientRepository) GetAllClients(params utils.PaginationParams) ([]models.Client, int, error) {
	searchQuery := "%" + params.Search + "%"
	
	countQuery := `
		SELECT COUNT(id) FROM clients
		WHERE name ILIKE $1 OR email ILIKE $1 OR organisation ILIKE $1
	`
	var total int
	err := r.db.QueryRow(context.Background(), countQuery, searchQuery).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	query := `
		SELECT
			id,
			name,
			organisation,
			address,
			city,
			state,
			country,
			gst_number,
			email,
			phone,
			created_at,
			updated_at
		FROM clients
		WHERE name ILIKE $1 OR email ILIKE $1 OR organisation ILIKE $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.db.Query(context.Background(), query, searchQuery, params.Limit, params.Offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var clients []models.Client

	for rows.Next() {
		var client models.Client
		err := rows.Scan(
			&client.ID,
			&client.Name,
			&client.Organisation,
			&client.Address,
			&client.City,
			&client.State,
			&client.Country,
			&client.GSTNumber,
			&client.Email,
			&client.Phone,
			&client.CreatedAt,
			&client.UpdatedAt,
		)
		if err != nil {
			return nil, 0, err
		}

		clients = append(clients, client)
	}

	return clients, total, rows.Err()
}

func (r *ClientRepository) UpdateClient(client *models.Client) error {
	query := `
		UPDATE clients
		SET
			name = $2,
			organisation = $3,
			address = $4,
			city = $5,
			state = $6,
			country = $7,
			gst_number = $8,
			email = $9,
			phone = $10,
			updated_at = $11
		WHERE id = $1
	`

	_, err := r.db.Exec(
		context.Background(),
		query,
		client.ID,
		client.Name,
		client.Organisation,
		client.Address,
		client.City,
		client.State,
		client.Country,
		client.GSTNumber,
		client.Email,
		client.Phone,
		client.UpdatedAt,
	)

	return err
}

func (r *ClientRepository) DeleteClient(id uuid.UUID) error {
	_, err := r.db.Exec(
		context.Background(),
		`DELETE FROM clients WHERE id = $1`,
		id,
	)

	return err
}
