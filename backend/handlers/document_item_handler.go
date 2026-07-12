package handlers

import (
	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func (h *DocumentHandler) CreateItem(c *fiber.Ctx) error {
	var item models.DocumentItem

	if err := c.BodyParser(&item); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if err := h.service.CreateItem(&item); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(item)
}

func (h *DocumentHandler) GetItemsByDocumentID(c *fiber.Ctx) error {
	documentID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": invalidDocumentIDMsg,
		})
	}

	items, err := h.service.GetItemsByDocumentID(documentID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(items)
}

func (h *DocumentHandler) DeleteItemsByDocumentID(c *fiber.Ctx) error {
	documentID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": invalidDocumentIDMsg,
		})
	}

	if err := h.service.DeleteItemsByDocumentID(documentID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
