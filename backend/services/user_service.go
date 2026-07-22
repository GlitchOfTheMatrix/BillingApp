package services

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/repositories"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/utils"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repo *repositories.UserRepository
}

func NewUserService(repo *repositories.UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}

func (s *UserService) Register(req *models.RegisterRequest) error {
	existingUser, err := s.repo.GetByEmail(req.Email)
	fmt.Println("GetByEmail returned:", existingUser, "error:", err)
	if existingUser != nil {
		return errors.New("an account with this email already exists")
	}

	hash, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		return err
	}

	user := models.User{
		ID:           uuid.New(),
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: string(hash),
		Role:         "admin",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	return s.repo.Create(&user)
}

func (s *UserService) Login(
	req *models.LoginRequest,
) (*models.LoginResponse, error) {
	user, err := s.repo.GetByEmail(req.Email)

	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(user.PasswordHash),
		[]byte(req.Password),
	)

	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	return s.generateTokens(user)
}

func (s *UserService) generateTokens(user *models.User) (*models.LoginResponse, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return nil, errors.New("JWT_SECRET environment variable is not set")
	}

	accessToken, err := utils.GenerateAccessToken(user.ID, user.Role, secret)
	if err != nil {
		return nil, err
	}

	refreshToken, err := utils.GenerateRefreshToken(user.ID, user.Role, secret)
	if err != nil {
		return nil, err
	}

	return &models.LoginResponse{
		User:         *user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *UserService) RefreshToken(req *models.RefreshRequest) (*models.LoginResponse, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return nil, errors.New("JWT_SECRET environment variable is not set")
	}

	claims, err := utils.ValidateToken(req.RefreshToken, secret)
	if err != nil {
		return nil, err
	}

	user, err := s.repo.GetByID(claims.UserID)
	if err != nil {
		return nil, err
	}

	return s.generateTokens(user)
}

func (s *UserService) ChangePassword(userID uuid.UUID, req *models.ChangePasswordRequest) error {
	user, err := s.repo.GetByID(userID)
	if err != nil {
		return err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.OldPassword))
	if err != nil {
		return errors.New("invalid old password")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.PasswordHash = string(hash)
	return s.repo.Update(user)
}

func (s *UserService) ForgotPassword(email string) (string, error) {
	user, err := s.repo.GetByEmail(email)
	if err != nil {
		return "", err
	} // Return err if not found to prevent leaking users, or return nil based on security preference

	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	token := hex.EncodeToString(bytes)

	expiration := time.Now().Add(1 * time.Hour)
	user.ResetToken = &token
	user.ResetTokenExpires = &expiration

	err = s.repo.Update(user)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (s *UserService) ResetPassword(req *models.ResetPasswordRequest) error {
	user, err := s.repo.GetByResetToken(req.Token)
	if err != nil {
		return errors.New("invalid or expired token")
	}

	if user.ResetTokenExpires.Before(time.Now()) {
		return errors.New("token expired")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.PasswordHash = string(hash)
	user.ResetToken = nil
	user.ResetTokenExpires = nil

	return s.repo.Update(user)
}

func (s *UserService) GetByID(id uuid.UUID) (*models.User, error) {
	return s.repo.GetByID(id)
}

func (s *UserService) GetAll(params utils.PaginationParams) (utils.PaginatedResponse, error) {
	users, total, err := s.repo.GetAll(params)
	if err != nil {
		return utils.PaginatedResponse{}, err
	}
	return utils.NewPaginatedResponse(users, total, params.Page, params.Limit), nil
}

func (s *UserService) Update(user *models.User) error {
	user.UpdatedAt = time.Now()
	return s.repo.Update(user)
}

func (s *UserService) Delete(id uuid.UUID) error {
	return s.repo.Delete(id)
}
