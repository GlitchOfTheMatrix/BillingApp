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
	"github.com/gofiber/fiber/v2/middleware/cors"
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
	// User
	userRepo := repositories.NewUserRepository(db)
	userService := services.NewUserService(userRepo)
	userHandler := handlers.NewUserHandler(userService)

	// Payment
	paymentRepo := repositories.NewPaymentRepository(db)
	paymentService := services.NewPaymentService(paymentRepo)
	paymentHandler := handlers.NewPaymentHandler(paymentService)

	// Company-Details
	companyRepo := repositories.NewCompanyDetailsRepository(db)
	companyService := services.NewCompanyDetailsService(companyRepo)
	companyHandler := handlers.NewCompanyDetailsHandler(companyService)

	documentHandler := handlers.NewDocumentHandler(documentService, clientService, companyService)

	app := fiber.New()
	app.Use(cors.New())

	routes.Setup(app, clientHandler, documentHandler, userHandler, paymentHandler, companyHandler)

	log.Fatal(app.Listen(":" + cfg.Port))
}
