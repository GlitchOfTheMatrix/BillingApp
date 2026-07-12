package repositories

import (
	"context"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (r *UserRepository) Create(user *models.User) error {
	query := `
		INSERT INTO users (
			id,
			name,
			email,
			password_hash,
			role
		)
		VALUES ($1, $2, $3, $4, $5)
	`

	_, err := r.db.Exec(
		context.Background(),
		query,
		user.ID,
		user.Name,
		user.Email,
		user.PasswordHash,
		user.Role,
	)

	return err
}

func (r *UserRepository) GetByID(id uuid.UUID) (*models.User, error) {
	query := `
		SELECT
			id,
			name,
			email,
			password_hash,
			role,
			created_at,
			updated_at
		FROM users
		WHERE id = $1
	`

	var user models.User

	err := r.db.QueryRow(
		context.Background(),
		query,
		id,
	).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	query := `
		SELECT
			id,
			name,
			email,
			password_hash,
			role,
			created_at,
			updated_at
		FROM users
		WHERE email = $1
	`

	var user models.User

	err := r.db.QueryRow(
		context.Background(),
		query,
		email,
	).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) GetAll() ([]models.User, error) {
	query := `
		SELECT
			id,
			name,
			email,
			password_hash,
			role,
			created_at,
			updated_at
		FROM users
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User

	for rows.Next() {
		var user models.User

		err := rows.Scan(
			&user.ID,
			&user.Name,
			&user.Email,
			&user.PasswordHash,
			&user.Role,
			&user.CreatedAt,
			&user.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		users = append(users, user)
	}

	return users, rows.Err()
}

func (r *UserRepository) Update(user *models.User) error {
	query := `
		UPDATE users
		SET
			name = $2,
			email = $3,
			role = $4,
			updated_at = NOW()
		WHERE id = $1
	`

	_, err := r.db.Exec(
		context.Background(),
		query,
		user.ID,
		user.Name,
		user.Email,
		user.Role,
	)

	return err
}

func (r *UserRepository) Delete(id uuid.UUID) error {
	_, err := r.db.Exec(
		context.Background(),
		`DELETE FROM users WHERE id = $1`,
		id,
	)

	return err
}
