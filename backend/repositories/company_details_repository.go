package repositories

import (
	"context"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/utils"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CompanyDetailsRepository struct {
	db *pgxpool.Pool
}

func NewCompanyDetailsRepository(db *pgxpool.Pool) *CompanyDetailsRepository {
	return &CompanyDetailsRepository{
		db: db,
	}
}

func (r *CompanyDetailsRepository) Create(company *models.CompanyDetails) error {
	query := `
		INSERT INTO company_details (
			id,
			company_name,
			gst_number,
			pan_number,
			msme_number,
			address,
			phone,
			email,
			website,
			bank_name,
			account_number,
			ifsc_code,
			branch
		)
		VALUES (
			$1,$2,$3,$4,$5,$6,$7,
			$8,$9,$10,$11,$12,$13
		)
	`

	_, err := r.db.Exec(
		context.Background(),
		query,
		company.ID,
		company.CompanyName,
		company.GSTNumber,
		company.PANNumber,
		company.MSMENumber,
		company.Address,
		company.Phone,
		company.Email,
		company.Website,
		company.BankName,
		company.AccountNumber,
		company.IFSCCode,
		company.Branch,
	)

	return err
}

func (r *CompanyDetailsRepository) GetByID(id uuid.UUID) (*models.CompanyDetails, error) {
	query := `
		SELECT
			id,
			company_name,
			gst_number,
			pan_number,
			msme_number,
			address,
			phone,
			email,
			website,
			bank_name,
			account_number,
			ifsc_code,
			branch,
			created_at,
			updated_at
		FROM company_details
		WHERE id = $1
	`

	var company models.CompanyDetails

	err := r.db.QueryRow(
		context.Background(),
		query,
		id,
	).Scan(
		&company.ID,
		&company.CompanyName,
		&company.GSTNumber,
		&company.PANNumber,
		&company.MSMENumber,
		&company.Address,
		&company.Phone,
		&company.Email,
		&company.Website,
		&company.BankName,
		&company.AccountNumber,
		&company.IFSCCode,
		&company.Branch,
		&company.CreatedAt,
		&company.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &company, nil
}

func (r *CompanyDetailsRepository) GetAll(params utils.PaginationParams) ([]models.CompanyDetails, int, error) {
	searchQuery := "%" + params.Search + "%"
	
	countQuery := `
		SELECT COUNT(id) FROM company_details
		WHERE company_name ILIKE $1 OR gst_number ILIKE $1 OR email ILIKE $1
	`
	var total int
	err := r.db.QueryRow(context.Background(), countQuery, searchQuery).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	query := `
		SELECT
			id,
			company_name,
			gst_number,
			pan_number,
			msme_number,
			address,
			phone,
			email,
			website,
			bank_name,
			account_number,
			ifsc_code,
			branch,
			created_at,
			updated_at
		FROM company_details
		WHERE company_name ILIKE $1 OR gst_number ILIKE $1 OR email ILIKE $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.db.Query(context.Background(), query, searchQuery, params.Limit, params.Offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var companies []models.CompanyDetails

	for rows.Next() {
		var company models.CompanyDetails

		err := rows.Scan(
			&company.ID,
			&company.CompanyName,
			&company.GSTNumber,
			&company.PANNumber,
			&company.MSMENumber,
			&company.Address,
			&company.Phone,
			&company.Email,
			&company.Website,
			&company.BankName,
			&company.AccountNumber,
			&company.IFSCCode,
			&company.Branch,
			&company.CreatedAt,
			&company.UpdatedAt,
		)

		if err != nil {
			return nil, 0, err
		}

		companies = append(companies, company)
	}

	return companies, total, rows.Err()
}

func (r *CompanyDetailsRepository) Update(company *models.CompanyDetails) error {
	query := `
		UPDATE company_details
		SET
			company_name = $2,
			gst_number = $3,
			pan_number = $4,
			msme_number = $5,
			address = $6,
			phone = $7,
			email = $8,
			website = $9,
			bank_name = $10,
			account_number = $11,
			ifsc_code = $12,
			branch = $13,
			updated_at = NOW()
		WHERE id = $1
	`

	_, err := r.db.Exec(
		context.Background(),
		query,
		company.ID,
		company.CompanyName,
		company.GSTNumber,
		company.PANNumber,
		company.MSMENumber,
		company.Address,
		company.Phone,
		company.Email,
		company.Website,
		company.BankName,
		company.AccountNumber,
		company.IFSCCode,
		company.Branch,
	)

	return err
}

func (r *CompanyDetailsRepository) Delete(id uuid.UUID) error {
	_, err := r.db.Exec(
		context.Background(),
		`DELETE FROM company_details WHERE id = $1`,
		id,
	)

	return err
}
