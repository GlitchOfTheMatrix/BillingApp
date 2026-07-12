package routes

import (
	"github.com/GlitchOfTheMatrix/BillingApp/backend/handlers"
	"github.com/gofiber/fiber/v2"
)

func Setup(
	app *fiber.App,
	clientHandler *handlers.ClientHandler,
	documentHandler *handlers.DocumentHandler,
	userHandler *handlers.UserHandler,
) {
	api := app.Group("/api")

	clients := api.Group("/clients")
	clients.Post("/", clientHandler.CreateClient)
	clients.Get("/", clientHandler.GetAllClients)
	clients.Get("/:id", clientHandler.GetClientByID)
	clients.Put("/:id", clientHandler.UpdateClient)
	clients.Delete("/:id", clientHandler.DeleteClient)

	documents := api.Group("/documents")
	documents.Post("/", documentHandler.CreateDocument)
	documents.Get("/", documentHandler.GetAllDocuments)
	documents.Get("/:id", documentHandler.GetDocumentByID)
	documents.Put("/:id", documentHandler.UpdateDocument)
	documents.Delete("/:id", documentHandler.DeleteDocument)
	documents.Post("/:id/duplicate", documentHandler.DuplicateDocument)

	auth := api.Group("/auth")
	auth.Post("/register", userHandler.Register)
	auth.Post("/login", userHandler.Login)

	users := api.Group("/users")
	users.Get("/", userHandler.GetAllUsers)
	users.Get("/:id", userHandler.GetUserByID)
	users.Put("/:id", userHandler.UpdateUser)
	users.Delete("/:id", userHandler.DeleteUser)
}
