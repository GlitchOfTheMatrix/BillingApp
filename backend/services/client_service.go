package services

import (
	"errors"
	"strings"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/repositories"
	"github.com/google/uuid"
)

type ClientService struct {
	repo *repositories.ClientRepository
}

func NewClientService(repo *repositories.ClientRepository) *ClientService {
	return &ClientService{
		repo: repo,
	}
}

func (s *ClientService) CreateClient(client *models.Client) error {
	client.Name = strings.TrimSpace(client.Name)

	if client.Name == "" {
		return errors.New("Client Name is required")
	}

	client.ID = uuid.New()

	return s.repo.CreateClient(client)
}

func (s *ClientService) GetClientByID(id uuid.UUID) (*models.Client, error) {
	return s.repo.GetClientByID(id)
}

func (s *ClientService) GetAllClients() ([]models.Client, error) {
	return s.repo.GetAllClients()
}

func (s *ClientService) UpdateClient(client *models.Client) error {
	client.Name = strings.TrimSpace(client.Name)

	if client.Name == "" {
		return errors.New("client name is required")
	}

	return s.repo.UpdateClient(client)

}

func (s *ClientService) DeleteClient(id uuid.UUID) error {
	return s.repo.DeleteClient(id)
}
