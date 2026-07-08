package repositories

import (
	"context"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type DocumentRepository struct {
	db *pgxpool.Pool
}

func NewDocumentRepository(db *pgxpool.Pool) *DocumentRepository {
	return &DocumentRepository{
		db: db,
	}
}

func (r *DocumentRepository) Create(document *models.Document) error {
	query := `
		INSERT INTO documents (
			id,
			document_type,
			document_number,
			document_date,
			client_id,
			source_document_id,
			order_number,
			order_date,
			status,
			subtotal,
			shipping,
			discount,
			cgst,
			sgst,
			igst,
			grand_total,
			amount_in_words,
			remarks,
			created_by
		)
		VALUES (
			$1,$2,$3,$4,$5,$6,$7,$8,$9,
			$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
		)
	`

	_, err := r.db.Exec(
		context.Background(),
		query,
		document.ID,
		document.DocumentType,
		document.DocumentNumber,
		document.DocumentDate,
		document.ClientID,
		document.SourceDocumentID,
		document.OrderNumber,
		document.OrderDate,
		document.Status,
		document.Subtotal,
		document.Shipping,
		document.Discount,
		document.CGST,
		document.SGST,
		document.IGST,
		document.GrandTotal,
		document.AmountInWords,
		document.Remarks,
		document.CreatedBy,
	)

	return err
}

func (r *DocumentRepository) GetByID(id uuid.UUID) (*models.Document, error) {
	query := `
		SELECT
			id,
			document_type,
			document_number,
			document_date,
			client_id,
			source_document_id,
			order_number,
			order_date,
			status,
			subtotal,
			shipping,
			discount,
			cgst,
			sgst,
			igst,
			grand_total,
			amount_in_words,
			remarks,
			created_by,
			created_at,
			updated_at
		FROM documents
		WHERE id = $1
	`

	var document models.Document

	err := r.db.QueryRow(
		context.Background(),
		query,
		id,
	).Scan(
		&document.ID,
		&document.DocumentType,
		&document.DocumentNumber,
		&document.DocumentDate,
		&document.ClientID,
		&document.SourceDocumentID,
		&document.OrderNumber,
		&document.OrderDate,
		&document.Status,
		&document.Subtotal,
		&document.Shipping,
		&document.Discount,
		&document.CGST,
		&document.SGST,
		&document.IGST,
		&document.GrandTotal,
		&document.AmountInWords,
		&document.Remarks,
		&document.CreatedBy,
		&document.CreatedAt,
		&document.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &document, nil
}

func (r *DocumentRepository) GetAll() ([]models.Document, error) {
	query := `
		SELECT
			id,
			document_type,
			document_number,
			document_date,
			client_id,
			source_document_id,
			order_number,
			order_date,
			status,
			subtotal,
			shipping,
			discount,
			cgst,
			sgst,
			igst,
			grand_total,
			amount_in_words,
			remarks,
			created_by,
			created_at,
			updated_at
		FROM documents
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var documents []models.Document

	for rows.Next() {
		var document models.Document

		err := rows.Scan(
			&document.ID,
			&document.DocumentType,
			&document.DocumentNumber,
			&document.DocumentDate,
			&document.ClientID,
			&document.SourceDocumentID,
			&document.OrderNumber,
			&document.OrderDate,
			&document.Status,
			&document.Subtotal,
			&document.Shipping,
			&document.Discount,
			&document.CGST,
			&document.SGST,
			&document.IGST,
			&document.GrandTotal,
			&document.AmountInWords,
			&document.Remarks,
			&document.CreatedBy,
			&document.CreatedAt,
			&document.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		documents = append(documents, document)
	}

	return documents, rows.Err()
}

func (r *DocumentRepository) Update(document *models.Document) error {
	query := `
		UPDATE documents
		SET
			document_type = $2,
			document_number = $3,
			document_date = $4,
			client_id = $5,
			source_document_id = $6,
			order_number = $7,
			order_date = $8,
			status = $9,
			subtotal = $10,
			shipping = $11,
			discount = $12,
			cgst = $13,
			sgst = $14,
			igst = $15,
			grand_total = $16,
			amount_in_words = $17,
			remarks = $18,
			updated_at = $19
		WHERE id = $1
	`

	_, err := r.db.Exec(
		context.Background(),
		query,
		document.ID,
		document.DocumentType,
		document.DocumentNumber,
		document.DocumentDate,
		document.ClientID,
		document.SourceDocumentID,
		document.OrderNumber,
		document.OrderDate,
		document.Status,
		document.Subtotal,
		document.Shipping,
		document.Discount,
		document.CGST,
		document.SGST,
		document.IGST,
		document.GrandTotal,
		document.AmountInWords,
		document.Remarks,
		document.UpdatedAt,
	)

	return err
}

func (r *DocumentRepository) Delete(id uuid.UUID) error {
	_, err := r.db.Exec(
		context.Background(),
		`DELETE FROM documents WHERE id = $1`,
		id,
	)

	return err
}
