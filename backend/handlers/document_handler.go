package handlers

import (
	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/services"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type DocumentHandler struct {
	service        *services.DocumentService
	clientService  *services.ClientService
	companyService *services.CompanyDetailsService
}

const invalidDocumentIDMsg = "invalid document id"

func NewDocumentHandler(service *services.DocumentService, clientService *services.ClientService, companyService *services.CompanyDetailsService) *DocumentHandler {
	return &DocumentHandler{
		service:        service,
		clientService:  clientService,
		companyService: companyService,
	}
}

func (h *DocumentHandler) CreateDocument(d *fiber.Ctx) error {
	var document models.Document

	if err := d.BodyParser(&document); err != nil {
		return d.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if errs := utils.ValidateStruct(document); errs != nil {
		return d.Status(fiber.StatusBadRequest).JSON(fiber.Map{"errors": errs})
	}

	userID, ok := d.Locals("user_id").(uuid.UUID)
	if !ok {
		return d.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}
	document.CreatedBy = userID

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
	params := utils.GetPaginationParams(d)
	response, err := h.service.GetAllDocuments(params)

	if err != nil {
		return d.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return d.JSON(response)
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

	if errs := utils.ValidateStruct(document); errs != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"errors": errs})
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

func (h *DocumentHandler) GeneratePDF(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": invalidDocumentIDMsg,
		})
	}

	document, err := h.service.GetDocumentByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "document not found",
		})
	}

	client, err := h.clientService.GetClientByID(document.ClientID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to retrieve client details",
		})
	}

	companyResp, err := h.companyService.GetAll(utils.PaginationParams{Limit: 1, Page: 1})
	if err != nil || companyResp.Total == 0 {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to retrieve company details",
		})
	}
	companies, ok := companyResp.Data.([]models.CompanyDetails)
	if !ok || len(companies) == 0 {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "invalid company details",
		})
	}
	company := &companies[0]

	pdfBytes, err := services.GenerateInvoicePDF(document, client, company)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to generate PDF",
		})
	}

	c.Set("Content-Type", "application/pdf")
	c.Set("Content-Disposition", `attachment; filename="invoice_`+document.DocumentNumber+`.pdf"`)
	return c.Send(pdfBytes)
}
