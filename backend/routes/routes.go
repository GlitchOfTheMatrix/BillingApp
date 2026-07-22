package routes

import (
	"github.com/GlitchOfTheMatrix/BillingApp/backend/handlers"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/middleware"
	"github.com/gofiber/fiber/v2"
)

func Setup(
	app *fiber.App,
	clientHandler *handlers.ClientHandler,
	documentHandler *handlers.DocumentHandler,
	userHandler *handlers.UserHandler,
	paymentHandler *handlers.PaymentHandler,
	companyHandler *handlers.CompanyDetailsHandler,
) {
	api := app.Group("/api")

	auth := api.Group("/auth")
	auth.Post("/register", userHandler.Register)
	auth.Post("/login", userHandler.Login)
	auth.Post("/refresh", userHandler.RefreshToken)
	auth.Post("/forgot-password", userHandler.ForgotPassword)
	auth.Post("/reset-password", userHandler.ResetPassword)
	auth.Post("/change-password", middleware.RequireAuth, userHandler.ChangePassword)
	auth.Get("/me", middleware.RequireAuth, userHandler.Me)

	clients := api.Group("/clients", middleware.RequireAuth)
	clients.Post("/", clientHandler.CreateClient)
	clients.Get("/", clientHandler.GetAllClients)
	clients.Get("/:id", clientHandler.GetClientByID)
	clients.Put("/:id", clientHandler.UpdateClient)
	clients.Delete("/:id", clientHandler.DeleteClient)

	documents := api.Group("/documents", middleware.RequireAuth)
	documents.Post("/", documentHandler.CreateDocument)
	documents.Get("/", documentHandler.GetAllDocuments)
	documents.Get("/:id", documentHandler.GetDocumentByID)
	documents.Get("/:id/pdf", documentHandler.GeneratePDF)
	documents.Put("/:id", documentHandler.UpdateDocument)
	documents.Delete("/:id", documentHandler.DeleteDocument)
	documents.Post("/:id/duplicate", documentHandler.DuplicateDocument)
	documents.Post("/:id/generate", documentHandler.GenerateDocumentFromSource)

	users := api.Group("/users", middleware.RequireAuth, middleware.RequireRole("admin"))
	users.Get("/", userHandler.GetAllUsers)
	users.Get("/:id", userHandler.GetUserByID)
	users.Put("/:id", userHandler.UpdateUser)
	users.Delete("/:id", userHandler.DeleteUser)

	payments := api.Group("/payments", middleware.RequireAuth)
	payments.Post("/", paymentHandler.CreatePayment)
	payments.Get("/", paymentHandler.GetAllPayments)
	payments.Get("/:id", paymentHandler.GetPaymentByID)
	payments.Put("/:id", paymentHandler.UpdatePayment)
	payments.Delete("/:id", paymentHandler.DeletePayment)

	companyDetails := api.Group("/company-details", middleware.RequireAuth)
	companyDetails.Post("/", companyHandler.CreateCompanyDetails)
	companyDetails.Get("/", companyHandler.GetAllCompanyDetails)
	companyDetails.Get("/:id", companyHandler.GetCompanyDetailsByID)
	companyDetails.Put("/:id", companyHandler.UpdateCompanyDetails)
	companyDetails.Delete("/:id", companyHandler.DeleteCompanyDetails)
}
