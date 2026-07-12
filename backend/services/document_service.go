package services

import (
	"time"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/repositories"
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

func (s *DocumentService) GetAllDocuments() ([]models.Document, error) {
	return s.repo.GetAll()
}

func (s *DocumentService) UpdateDocument(document *models.Document) error {
	document.UpdatedAt = time.Now()

	for i := range document.Items {
		document.Items[i].ID = uuid.New()
		document.Items[i].DocumentID = document.ID
		document.Items[i].UpdatedAt = time.Now()
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

	oldId := document.ID

	document.ID = uuid.New()
	// document.DocumentNumber = GenerateDocumentNumber()
	document.Status = models.DocumentStatusDraft
	document.CreatedAt = time.Now()
	document.UpdatedAt = time.Now()

	items, err := s.repo.GetItemsByDocumentID(oldId)
	if err != nil {
		return nil, err
	}

	document.Items = items

	if err := s.repo.Create(document); err != nil {
		return nil, err
	}

	for i := range document.Items {
		document.Items[i].ID = uuid.New()
		document.Items[i].DocumentID = document.ID
		document.Items[i].CreatedAt = time.Now()
		document.Items[i].UpdatedAt = time.Now()

		if err := s.repo.CreateItem(&document.Items[i]); err != nil {
			return nil, err
		}
	}

	return document, nil
}
