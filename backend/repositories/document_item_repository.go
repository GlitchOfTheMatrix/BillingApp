package repositories

import (
	"context"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/google/uuid"
)

func (r *DocumentRepository) CreateItem(item *models.DocumentItem) error {
	query := `
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

	_, err := r.db.Exec(
		context.Background(),
		query,
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

	return err
}

func (r *DocumentRepository) GetItemsByDocumentID(documentID uuid.UUID) ([]models.DocumentItem, error) {
	query := `
		SELECT
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
			extra,
			created_at,
			updated_at
		FROM document_items
		WHERE document_id = $1
		ORDER BY serial_no
	`

	rows, err := r.db.Query(context.Background(), query, documentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.DocumentItem

	for rows.Next() {
		var item models.DocumentItem

		err := rows.Scan(
			&item.ID,
			&item.DocumentID,
			&item.SerialNo,
			&item.SoftwareName,
			&item.Description,
			&item.HSNCode,
			&item.LicenseType,
			&item.SubscriptionDuration,
			&item.Quantity,
			&item.Unit,
			&item.Rate,
			&item.Discount,
			&item.TaxRate,
			&item.Total,
			&item.Extra,
			&item.CreatedAt,
			&item.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		items = append(items, item)
	}

	return items, rows.Err()
}

func (r *DocumentRepository) DeleteItemsByDocumentID(documentID uuid.UUID) error {
	_, err := r.db.Exec(
		context.Background(),
		`DELETE FROM document_items WHERE document_id = $1`,
		documentID,
	)

	return err
}
