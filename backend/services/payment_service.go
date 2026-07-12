package services

import (
	"time"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/repositories"
	"github.com/google/uuid"
)

type PaymentService struct {
	repo *repositories.PaymentRepository
}

func NewPaymentService(repo *repositories.PaymentRepository) *PaymentService {
	return &PaymentService{
		repo: repo,
	}
}

func (s *PaymentService) Create(payment *models.Payment) error {
	now := time.Now()

	payment.ID = uuid.New()
	payment.CreatedAt = now
	payment.UpdatedAt = now

	return s.repo.Create(payment)
}

func (s *PaymentService) GetByID(id uuid.UUID) (*models.Payment, error) {
	return s.repo.GetByID(id)
}

func (s *PaymentService) GetAll() ([]models.Payment, error) {
	return s.repo.GetAll()
}

func (s *PaymentService) Update(payment *models.Payment) error {
	payment.UpdatedAt = time.Now()

	return s.repo.Update(payment)
}

func (s *PaymentService) Delete(id uuid.UUID) error {
	return s.repo.Delete(id)
}
