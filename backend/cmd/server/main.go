package main

import (
	"log"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/configs"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/database"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/handlers"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/repositories"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/routes"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/services"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal(err)
	}

	cfg, err := configs.Load()
	if err != nil {
		log.Fatal(err)
	}

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Client
	clientRepo := repositories.NewClientRepository(db)
	clientService := services.NewClientService(clientRepo)
	clientHandler := handlers.NewClientHandler(clientService)

	// Document
	documentRepo := repositories.NewDocumentRepository(db)
	documentService := services.NewDocumentService(documentRepo)
	documentHandler := handlers.NewDocumentHandler(documentService)

	app := fiber.New()

	routes.Setup(app, clientHandler, documentHandler)

	log.Fatal(app.Listen(":" + cfg.Port))
}
