package repositories

import (
	"context"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/utils"
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
			reset_token,
			reset_token_expires,
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
		&user.ResetToken,
		&user.ResetTokenExpires,
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
			reset_token,
			reset_token_expires,
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
		&user.ResetToken,
		&user.ResetTokenExpires,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) GetAll(params utils.PaginationParams) ([]models.User, int, error) {
	searchQuery := "%" + params.Search + "%"
	
	countQuery := `
		SELECT COUNT(id) FROM users
		WHERE name ILIKE $1 OR email ILIKE $1 OR role ILIKE $1
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
			email,
			password_hash,
			role,
			reset_token,
			reset_token_expires,
			created_at,
			updated_at
		FROM users
		WHERE name ILIKE $1 OR email ILIKE $1 OR role ILIKE $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.db.Query(context.Background(), query, searchQuery, params.Limit, params.Offset)
	if err != nil {
		return nil, 0, err
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
			&user.ResetToken,
			&user.ResetTokenExpires,
			&user.CreatedAt,
			&user.UpdatedAt,
		)

		if err != nil {
			return nil, 0, err
		}

		users = append(users, user)
	}

	return users, total, rows.Err()
}

func (r *UserRepository) Update(user *models.User) error {
	query := `
		UPDATE users
		SET
			name = $2,
			email = $3,
			password_hash = $4,
			role = $5,
			reset_token = $6,
			reset_token_expires = $7,
			updated_at = NOW()
		WHERE id = $1
	`

	_, err := r.db.Exec(
		context.Background(),
		query,
		user.ID,
		user.Name,
		user.Email,
		user.PasswordHash,
		user.Role,
		user.ResetToken,
		user.ResetTokenExpires,
	)

	return err
}

func (r *UserRepository) GetByResetToken(token string) (*models.User, error) {
	query := `
		SELECT
			id,
			name,
			email,
			password_hash,
			role,
			reset_token,
			reset_token_expires,
			created_at,
			updated_at
		FROM users
		WHERE reset_token = $1
	`

	var user models.User

	err := r.db.QueryRow(
		context.Background(),
		query,
		token,
	).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.ResetToken,
		&user.ResetTokenExpires,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) Delete(id uuid.UUID) error {
	_, err := r.db.Exec(
		context.Background(),
		`DELETE FROM users WHERE id = $1`,
		id,
	)

	return err
}
