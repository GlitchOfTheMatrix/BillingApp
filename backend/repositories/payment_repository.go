package repositories

import (
	"context"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PaymentRepository struct {
	db *pgxpool.Pool
}

func NewPaymentRepository(db *pgxpool.Pool) *PaymentRepository {
	return &PaymentRepository{
		db: db,
	}
}

func (r *PaymentRepository) Create(payment *models.Payment) error {
	query := `
		INSERT INTO payments (
			id,
			invoice_id,
			payment_date,
			amount,
			mode,
			utr_number,
			bank_name,
			status,
			remarks
		)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
	`

	_, err := r.db.Exec(
		context.Background(),
		query,
		payment.ID,
		payment.InvoiceID,
		payment.PaymentDate,
		payment.Amount,
		payment.Mode,
		payment.UTRNumber,
		payment.BankName,
		payment.Status,
		payment.Remarks,
	)

	return err
}

func (r *PaymentRepository) GetByID(id uuid.UUID) (*models.Payment, error) {
	query := `
		SELECT
			id,
			invoice_id,
			payment_date,
			amount,
			mode,
			utr_number,
			bank_name,
			status,
			remarks,
			created_at,
			updated_at
		FROM payments
		WHERE id = $1
	`

	var payment models.Payment

	err := r.db.QueryRow(
		context.Background(),
		query,
		id,
	).Scan(
		&payment.ID,
		&payment.InvoiceID,
		&payment.PaymentDate,
		&payment.Amount,
		&payment.Mode,
		&payment.UTRNumber,
		&payment.BankName,
		&payment.Status,
		&payment.Remarks,
		&payment.CreatedAt,
		&payment.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &payment, nil
}

func (r *PaymentRepository) GetAll() ([]models.Payment, error) {
	query := `
		SELECT
			id,
			invoice_id,
			payment_date,
			amount,
			mode,
			utr_number,
			bank_name,
			status,
			remarks,
			created_at,
			updated_at
		FROM payments
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var payments []models.Payment

	for rows.Next() {
		var payment models.Payment

		err := rows.Scan(
			&payment.ID,
			&payment.InvoiceID,
			&payment.PaymentDate,
			&payment.Amount,
			&payment.Mode,
			&payment.UTRNumber,
			&payment.BankName,
			&payment.Status,
			&payment.Remarks,
			&payment.CreatedAt,
			&payment.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		payments = append(payments, payment)
	}

	return payments, rows.Err()
}

func (r *PaymentRepository) Update(payment *models.Payment) error {
	query := `
		UPDATE payments
		SET
			invoice_id = $2,
			payment_date = $3,
			amount = $4,
			mode = $5,
			utr_number = $6,
			bank_name = $7,
			status = $8,
			remarks = $9,
			updated_at = NOW()
		WHERE id = $1
	`

	_, err := r.db.Exec(
		context.Background(),
		query,
		payment.ID,
		payment.InvoiceID,
		payment.PaymentDate,
		payment.Amount,
		payment.Mode,
		payment.UTRNumber,
		payment.BankName,
		payment.Status,
		payment.Remarks,
	)

	return err
}

func (r *PaymentRepository) Delete(id uuid.UUID) error {
	_, err := r.db.Exec(
		context.Background(),
		`DELETE FROM payments WHERE id = $1`,
		id,
	)

	return err
}
