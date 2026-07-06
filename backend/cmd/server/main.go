package main

import (
	"log"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/configs"
	"github.com/GlitchOfTheMatrix/BillingApp/backend/database"
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

	app := fiber.New()

	log.Fatal(app.Listen(":" + cfg.Port))
}
