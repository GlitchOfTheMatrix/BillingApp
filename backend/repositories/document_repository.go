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
	ctx := context.Background()

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	documentQuery := `
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

	_, err = tx.Exec(
		ctx,
		documentQuery,
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
	if err != nil {
		return err
	}

	itemQuery := `
		INSERT INTO document_items (
			id,
			document_id,
			serial_no,
			software_name,
			description,
			hsn_code,
			license_type,
			subscription_duration,
			quantity,
			unit,
			rate,
			discount,
			tax_rate,
			total,
			extra
		)
		VALUES (
			$1,$2,$3,$4,$5,$6,$7,$8,
			$9,$10,$11,$12,$13,$14,$15
		)
	`

	for _, item := range document.Items {
		_, err = tx.Exec(
			ctx,
			itemQuery,
			item.ID,
			item.DocumentID,
			item.SerialNo,
			item.SoftwareName,
			item.Description,
			item.HSNCode,
			item.LicenseType,
			item.SubscriptionDuration,
			item.Quantity,
			item.Unit,
			item.Rate,
			item.Discount,
			item.TaxRate,
			item.Total,
			item.Extra,
		)

		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
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

		items, err := r.GetItemsByDocumentID(document.ID)
		if err != nil {
			return nil, err
		}

		document.Items = items

		documents = append(documents, document)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return documents, nil
}

func (r *DocumentRepository) Update(document *models.Document) error {
	ctx := context.Background()

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

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
			updated_at = NOW()
		WHERE id = $1
	`

	_, err = tx.Exec(
		ctx,
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
	)
	if err != nil {
		return err
	}

	_, err = tx.Exec(
		ctx,
		`DELETE FROM document_items WHERE document_id = $1`,
		document.ID,
	)
	if err != nil {
		return err
	}

	itemQuery := `
		INSERT INTO document_items (
			id,
			document_id,
			serial_no,
			software_name,
			description,
			hsn_code,
			license_type,
			subscription_duration,
			quantity,
			unit,
			rate,
			discount,
			tax_rate,
			total,
			extra
		)
		VALUES (
			$1,$2,$3,$4,$5,$6,$7,$8,
			$9,$10,$11,$12,$13,$14,$15
		)
	`

	for _, item := range document.Items {
		_, err = tx.Exec(
			ctx,
			itemQuery,
			item.ID,
			item.DocumentID,
			item.SerialNo,
			item.SoftwareName,
			item.Description,
			item.HSNCode,
			item.LicenseType,
			item.SubscriptionDuration,
			item.Quantity,
			item.Unit,
			item.Rate,
			item.Discount,
			item.TaxRate,
			item.Total,
			item.Extra,
		)

		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
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

	items, err := r.GetItemsByDocumentID(id)
	if err != nil {
		return nil, err
	}

	document.Items = items

	return &document, nil
}

func (r *DocumentRepository) Delete(id uuid.UUID) error {
	_, err := r.db.Exec(
		context.Background(),
		`DELETE FROM documents WHERE id = $1`,
		id,
	)

	return err
}
