package handlers

import (
	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/services"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type CompanyDetailsHandler struct {
	service *services.CompanyDetailsService
}

const invalidCompanyID = "invalid company id"

func NewCompanyDetailsHandler(
	service *services.CompanyDetailsService,
) *CompanyDetailsHandler {
	return &CompanyDetailsHandler{
		service: service,
	}
}

func (h *CompanyDetailsHandler) CreateCompanyDetails(c *fiber.Ctx) error {
	var company models.CompanyDetails

	if err := c.BodyParser(&company); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"error": err.Error(),
			},
		)
	}

	if err := h.service.Create(&company); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			fiber.Map{
				"error": err.Error(),
			},
		)
	}

	return c.Status(fiber.StatusCreated).JSON(company)
}

func (h *CompanyDetailsHandler) GetCompanyDetailsByID(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"error": invalidCompanyID,
			},
		)
	}

	company, err := h.service.GetByID(id)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(
			fiber.Map{
				"error": err.Error(),
			},
		)
	}

	return c.JSON(company)
}

func (h *CompanyDetailsHandler) GetAllCompanyDetails(c *fiber.Ctx) error {
	companies, err := h.service.GetAll()

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			fiber.Map{
				"error": err.Error(),
			},
		)
	}

	return c.JSON(companies)
}

func (h *CompanyDetailsHandler) UpdateCompanyDetails(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"error": invalidCompanyID,
			},
		)
	}

	var company models.CompanyDetails

	if err := c.BodyParser(&company); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"error": err.Error(),
			},
		)
	}

	company.ID = id

	if err := h.service.Update(&company); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			fiber.Map{
				"error": err.Error(),
			},
		)
	}

	return c.JSON(company)
}

func (h *CompanyDetailsHandler) DeleteCompanyDetails(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"error": invalidCompanyID,
			},
		)
	}

	if err := h.service.Delete(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			fiber.Map{
				"error": err.Error(),
			},
		)
	}

	return c.SendStatus(fiber.StatusNoContent)
}
