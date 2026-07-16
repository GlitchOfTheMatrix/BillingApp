package utils

import (
	"math"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type PaginationParams struct {
	Page   int
	Limit  int
	Offset int
	Search string
}

type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Total      int         `json:"total"`
	Page       int         `json:"page"`
	Limit      int         `json:"limit"`
	TotalPages int         `json:"total_pages"`
}

func GetPaginationParams(c *fiber.Ctx) PaginationParams {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit
	search := c.Query("search", "")

	return PaginationParams{
		Page:   page,
		Limit:  limit,
		Offset: offset,
		Search: search,
	}
}

func NewPaginatedResponse(data interface{}, total, page, limit int) PaginatedResponse {
	totalPages := int(math.Ceil(float64(total) / float64(limit)))
	return PaginatedResponse{
		Data:       data,
		Total:      total,
		Page:       page,
		Limit:      limit,
		TotalPages: totalPages,
	}
}
