package services

import (
	"fmt"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/johnfercher/maroto/v2"
	"github.com/johnfercher/maroto/v2/pkg/components/col"
	"github.com/johnfercher/maroto/v2/pkg/components/row"
	"github.com/johnfercher/maroto/v2/pkg/components/text"
	"github.com/johnfercher/maroto/v2/pkg/config"
	"github.com/johnfercher/maroto/v2/pkg/consts/align"
	"github.com/johnfercher/maroto/v2/pkg/consts/fontstyle"
	"github.com/johnfercher/maroto/v2/pkg/props"
)

func GenerateInvoicePDF(
	doc *models.Document,
	client *models.Client,
	company *models.CompanyDetails,
) ([]byte, error) {
	cfg := config.NewBuilder().
		WithPageSize("A4").
		WithLeftMargin(10).
		WithTopMargin(15).
		WithRightMargin(10).
		Build()

	m := maroto.New(cfg)

	m.AddRows(
		row.New(10).Add(
			col.New(12).Add(
				text.New(
					company.CompanyName,
					props.Text{
						Style: fontstyle.Bold,
						Size:  18,
						Align: align.Center,
					},
				),
			),
		),

		row.New(5).Add(
			col.New(12).Add(
				text.New(
					"GST: "+company.GSTNumber+
						" | PAN: "+company.PANNumber,
					props.Text{
						Align: align.Center,
					},
				),
			),
		),

		row.New(5).Add(
			col.New(12).Add(
				text.New(
					company.Address,
					props.Text{
						Align: align.Center,
					},
				),
			),
		),

		row.New(5).Add(
			col.New(12).Add(
				text.New(
					company.Phone+" | "+company.Email,
					props.Text{
						Align: align.Center,
					},
				),
			),
		),

		row.New(5).Add(
			col.New(12).Add(
				text.New(
					company.BankName+
						" | A/C: "+company.AccountNumber+
						" | IFSC: "+company.IFSCCode,
					props.Text{
						Align: align.Center,
					},
				),
			),
		),

		row.New(20).Add(
			col.New(12).Add(
				text.New(
					string(doc.DocumentType)+" "+doc.DocumentNumber,
					props.Text{
						Top:   5,
						Style: fontstyle.Bold,
						Align: align.Center,
						Size:  20,
					},
				),
			),
		),

		row.New(10).Add(
			col.New(6).Add(
				text.New(
					"Billed To:",
					props.Text{
						Style: fontstyle.Bold,
					},
				),
			),

			col.New(6).Add(
				text.New(
					"Date: "+doc.DocumentDate.Format("02-Jan-2006"),
					props.Text{
						Align: align.Right,
					},
				),
			),
		),

		row.New(5).Add(
			col.New(12).Add(
				text.New(client.Name, props.Text{}),
			),
		),

		row.New(5).Add(
			col.New(12).Add(
				text.New(client.Organisation, props.Text{}),
			),
		),

		row.New(5).Add(
			col.New(12).Add(
				text.New(client.Address, props.Text{}),
			),
		),

		row.New(10).Add(
			col.New(12).Add(
				text.New(
					client.City+", "+client.State+" - "+client.Country,
					props.Text{},
				),
			),
		),
	)

	m.AddRows(
		row.New(10).Add(
			col.New(4).Add(
				text.New(
					"Description",
					props.Text{
						Style: fontstyle.Bold,
					},
				),
			),

			col.New(2).Add(
				text.New(
					"Quantity",
					props.Text{
						Style: fontstyle.Bold,
						Align: align.Center,
					},
				),
			),

			col.New(3).Add(
				text.New(
					"Rate",
					props.Text{
						Style: fontstyle.Bold,
						Align: align.Center,
					},
				),
			),

			col.New(3).Add(
				text.New(
					"Amount",
					props.Text{
						Style: fontstyle.Bold,
						Align: align.Right,
					},
				),
			),
		),
	)

	for _, item := range doc.Items {
		m.AddRows(
			row.New(10).Add(
				col.New(4).Add(
					text.New(item.Description, props.Text{}),
				),

				col.New(2).Add(
					text.New(
						fmt.Sprintf("%d %s", item.Quantity, item.Unit),
						props.Text{
							Align: align.Center,
						},
					),
				),

				col.New(3).Add(
					text.New(
						item.Rate.StringFixed(2),
						props.Text{
							Align: align.Center,
						},
					),
				),

				col.New(3).Add(
					text.New(
						item.Total.StringFixed(2),
						props.Text{
							Align: align.Right,
						},
					),
				),
			),
		)
	}

	m.AddRows(
		row.New(10).Add(
			col.New(9).Add(
				text.New(
					"Subtotal:",
					props.Text{
						Align: align.Right,
						Style: fontstyle.Bold,
					},
				),
			),

			col.New(3).Add(
				text.New(
					doc.Subtotal.StringFixed(2),
					props.Text{
						Align: align.Right,
					},
				),
			),
		),

		row.New(10).Add(
			col.New(9).Add(
				text.New(
					"CGST:",
					props.Text{
						Align: align.Right,
					},
				),
			),

			col.New(3).Add(
				text.New(
					doc.CGST.StringFixed(2),
					props.Text{
						Align: align.Right,
					},
				),
			),
		),

		row.New(10).Add(
			col.New(9).Add(
				text.New(
					"SGST:",
					props.Text{
						Align: align.Right,
					},
				),
			),

			col.New(3).Add(
				text.New(
					doc.SGST.StringFixed(2),
					props.Text{
						Align: align.Right,
					},
				),
			),
		),

		row.New(10).Add(
			col.New(9).Add(
				text.New(
					"IGST:",
					props.Text{
						Align: align.Right,
					},
				),
			),

			col.New(3).Add(
				text.New(
					doc.IGST.StringFixed(2),
					props.Text{
						Align: align.Right,
					},
				),
			),
		),

		row.New(10).Add(
			col.New(9).Add(
				text.New(
					"Grand Total:",
					props.Text{
						Align: align.Right,
						Style: fontstyle.Bold,
					},
				),
			),

			col.New(3).Add(
				text.New(
					doc.GrandTotal.StringFixed(2),
					props.Text{
						Align: align.Right,
						Style: fontstyle.Bold,
					},
				),
			),
		),
	)

	docGen, err := m.Generate()
	if err != nil {
		return nil, err
	}

	return docGen.GetBytes(), nil
}
