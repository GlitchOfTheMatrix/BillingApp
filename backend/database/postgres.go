package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Connect(databaseURL string) (*pgxpool.Pool, error) {
	db, err := pgxpool.New(context.Background(), databaseURL)

	if err != nil {
		return nil, err
	}
	if err := db.Ping(context.Background()); err != nil {
		db.Close()
		return nil, err
	}

	fmt.Println("Connected to PostgreSql")

	return db, nil
}
