package routes

import (
	"github.com/GlitchOfTheMatrix/BillingApp/backend/handlers"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App, clientHandler *handlers.ClientHandler) {
	api := app.Group("/api")

	clients := api.Group("/clients")

	clients.Post("/", clientHandler.CreateClient)
	clients.Get("/", clientHandler.GetAllClients)
	clients.Get("/:id", clientHandler.GetClientByID)
	clients.Put("/:id", clientHandler.UpdateClient)
	clients.Delete("/:id", clientHandler.DeleteClient)
}
