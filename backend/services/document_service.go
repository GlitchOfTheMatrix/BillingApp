package services

import (
	"time"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/repositories"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/utils"
	"github.com/google/uuid"
)

type DocumentService struct {
	repo *repositories.DocumentRepository
}

func NewDocumentService(repo *repositories.DocumentRepository) *DocumentService {
	return &DocumentService{
		repo: repo,
	}
}

func (s *DocumentService) CreateDocument(document *models.Document) error {
	now := time.Now()

	document.ID = uuid.New()
	document.CreatedAt = now
	document.UpdatedAt = now

	for i := range document.Items {
		document.Items[i].ID = uuid.New()
		document.Items[i].DocumentID = document.ID
		document.Items[i].CreatedAt = now
		document.Items[i].UpdatedAt = now
	}

	return s.repo.Create(document)
}

func (s *DocumentService) GetDocumentByID(id uuid.UUID) (*models.Document, error) {
	return s.repo.GetByID(id)
}

func (s *DocumentService) GetAllDocuments(
	params utils.PaginationParams,
) (utils.PaginatedResponse, error) {
	documents, total, err := s.repo.GetAllDocuments(params)
	if err != nil {
		return utils.PaginatedResponse{}, err
	}

	return utils.NewPaginatedResponse(
		documents,
		total,
		params.Page,
		params.Limit,
	), nil
}

func (s *DocumentService) UpdateDocument(document *models.Document) error {
	now := time.Now()

	document.UpdatedAt = now

	existingDoc, err := s.repo.GetByID(document.ID)
	if err == nil && existingDoc != nil {
		existingItemsMap := make(map[uuid.UUID]time.Time)
		for _, item := range existingDoc.Items {
			existingItemsMap[item.ID] = item.CreatedAt
		}

		for i := range document.Items {
			document.Items[i].DocumentID = document.ID
			document.Items[i].UpdatedAt = now

			if document.Items[i].ID == uuid.Nil {
				document.Items[i].ID = uuid.New()
				document.Items[i].CreatedAt = now
			} else {
				if createdAt, exists := existingItemsMap[document.Items[i].ID]; exists {
					document.Items[i].CreatedAt = createdAt
				} else {
					document.Items[i].CreatedAt = now
				}
			}
		}
	} else {
		for i := range document.Items {
			if document.Items[i].ID == uuid.Nil {
				document.Items[i].ID = uuid.New()
			}
			document.Items[i].DocumentID = document.ID
			document.Items[i].CreatedAt = now
			document.Items[i].UpdatedAt = now
		}
	}

	return s.repo.Update(document)
}

func (s *DocumentService) DeleteDocument(id uuid.UUID) error {
	return s.repo.Delete(id)
}

func (s *DocumentService) DuplicateDocument(id uuid.UUID) (*models.Document, error) {
	document, err := s.GetDocumentByID(id)
	if err != nil {
		return nil, err
	}

	now := time.Now()

	document.ID = uuid.New()
	document.Status = models.DocumentStatusDraft
	document.CreatedAt = now
	document.UpdatedAt = now

	items, err := s.repo.GetItemsByDocumentID(id)
	if err != nil {
		return nil, err
	}

	document.Items = items

	for i := range document.Items {
		document.Items[i].ID = uuid.New()
		document.Items[i].DocumentID = document.ID
		document.Items[i].CreatedAt = now
		document.Items[i].UpdatedAt = now
	}

	if err := s.repo.Create(document); err != nil {
		return nil, err
	}

	return document, nil
}
