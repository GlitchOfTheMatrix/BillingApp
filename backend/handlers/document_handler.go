package handlers

import (
	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/services"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type DocumentHandler struct {
	service *services.DocumentService
}

const invalidDocumentIDMsg = "invalid document id"

func NewDocumentHandler(service *services.DocumentService) *DocumentHandler {
	return &DocumentHandler{
		service: service,
	}
}

func (h *DocumentHandler) CreateDocument(d *fiber.Ctx) error {
	var document models.Document

	if err := d.BodyParser(&document); err != nil {
		return d.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if err := h.service.CreateDocument(&document); err != nil {
		return d.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return d.Status(fiber.StatusCreated).JSON(document)
}

func (h *DocumentHandler) GetDocumentByID(d *fiber.Ctx) error {
	id, err := uuid.Parse(d.Params("id"))
	if err != nil {
		return d.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": invalidDocumentIDMsg,
		})
	}

	document, err := h.service.GetDocumentByID(id)
	if err != nil {
		return d.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "document not found",
		})
	}

	return d.JSON(document)
}

func (h *DocumentHandler) GetAllDocuments(d *fiber.Ctx) error {
	documents, err := h.service.GetAllDocuments()

	if err != nil {
		return d.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return d.JSON(documents)
}

func (h *DocumentHandler) UpdateDocument(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": invalidDocumentIDMsg,
		})
	}

	var document models.Document

	if err := c.BodyParser(&document); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	document.ID = id

	if err := h.service.UpdateDocument(&document); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(document)
}

func (h *DocumentHandler) DeleteDocument(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": invalidDocumentIDMsg,
		})
	}

	if err := h.service.DeleteDocument(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func (h *DocumentHandler) DuplicateDocument(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": invalidDocumentIDMsg,
		})
	}

	document, err := h.service.DuplicateDocument(id)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(document)
}
