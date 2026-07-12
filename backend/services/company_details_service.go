package services

import (
	"time"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/repositories"
	"github.com/google/uuid"
)

type CompanyDetailsService struct {
	repo *repositories.CompanyDetailsRepository
}

func NewCompanyDetailsService(
	repo *repositories.CompanyDetailsRepository,
) *CompanyDetailsService {
	return &CompanyDetailsService{
		repo: repo,
	}
}

func (s *CompanyDetailsService) Create(company *models.CompanyDetails) error {
	now := time.Now()

	company.ID = uuid.New()
	company.CreatedAt = now
	company.UpdatedAt = now

	return s.repo.Create(company)
}

func (s *CompanyDetailsService) GetByID(id uuid.UUID) (*models.CompanyDetails, error) {
	return s.repo.GetByID(id)
}

func (s *CompanyDetailsService) GetAll() ([]models.CompanyDetails, error) {
	return s.repo.GetAll()
}

func (s *CompanyDetailsService) Update(company *models.CompanyDetails) error {
	company.UpdatedAt = time.Now()

	return s.repo.Update(company)
}

func (s *CompanyDetailsService) Delete(id uuid.UUID) error {
	return s.repo.Delete(id)
}
