package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

type Repository struct {
	DB *gorm.DB
}

func (r *Repository) setuproutes(app *fiber.App) {
	api := app.Group("/api")
	api.Post("/createQuotation", r.CreateQuotation)
	api.Post("/createProformaInvoice", r.CreateProformaInvoice)
	api.Post("/createTaxInvoice", r.CreateTaxInvoice)
	api.Get("/getQuotation/:id", r.GetQuotation)
	api.Get("/getProformaInvoice/:id", r.GetProformaInvoice)
	api.Get("/getTaxInvoice/:id", r.GetTaxInvoice)
}

func main() {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal(err)
	}

	db, err := storage.NewConnection(config)

	if err != nil {
		log.Fatal("Could not load the database", err)
	}
	app := fiber.New()

	r := Repository{
		DB: db,
	}

	r.setuproutes(app)
	app.Listen(":8080")
}
