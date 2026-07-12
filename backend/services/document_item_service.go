package services

import (
	"time"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/google/uuid"
)

func (s *DocumentService) CreateItem(item *models.DocumentItem) error {
	item.ID = uuid.New()
	item.CreatedAt = time.Now()
	item.UpdatedAt = time.Now()

	return s.repo.CreateItem(item)
}

func (s *DocumentService) GetItemsByDocumentID(documentID uuid.UUID) ([]models.DocumentItem, error) {
	return s.repo.GetItemsByDocumentID(documentID)
}

func (s *DocumentService) DeleteItemsByDocumentID(documentID uuid.UUID) error {
	return s.repo.DeleteItemsByDocumentID(documentID)
}
