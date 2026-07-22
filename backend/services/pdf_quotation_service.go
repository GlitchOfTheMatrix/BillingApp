package services

import (
	"fmt"

	"github.com/GlitchOfTheMatrix/BillingApp/backend/models"
	"github.com/johnfercher/maroto/v2"
	"github.com/johnfercher/maroto/v2/pkg/components/col"
	"github.com/johnfercher/maroto/v2/pkg/components/image"
	"github.com/johnfercher/maroto/v2/pkg/components/row"
	"github.com/johnfercher/maroto/v2/pkg/components/text"
	"github.com/johnfercher/maroto/v2/pkg/config"
	"github.com/johnfercher/maroto/v2/pkg/consts/align"
	"github.com/johnfercher/maroto/v2/pkg/consts/border"
	"github.com/johnfercher/maroto/v2/pkg/consts/fontstyle"
	"github.com/johnfercher/maroto/v2/pkg/props"
)

func GenerateQuotationPDF(
	doc *models.Document,
	client *models.Client,
	company *models.CompanyDetails,
) ([]byte, error) {
	cfg := config.NewBuilder().
		WithPageSize("A4").
		WithLeftMargin(10).
		WithTopMargin(10).
		WithRightMargin(10).
		Build()

	m := maroto.New(cfg)

	blueColor := &props.Color{Red: 0, Green: 32, Blue: 96}
	headerBgColor := &props.Color{Red: 217, Green: 226, Blue: 211}
	
	// 1. HEADER ROW
	m.AddRows(
		row.New(30).Add(
			col.New(4).Add(
				image.NewFromFile("assets/MillenniumSystemsLogo.png", props.Rect{
					Center:  false,
					Percent: 100,
					Top:     2,
				}),
			),
			col.New(8).Add(
				text.New(
					"MILLENNIUM SYSTEMS",
					props.Text{
						Style: fontstyle.Bold,
						Size:  22,
						Align: align.Right,
						Color: blueColor,
					},
				),
				text.New(
					"2nd Floor, Elegance Tower, Jasola District Center,\nOld Mathura Road, New Delhi - 110025.",
					props.Text{
						Size:  9,
						Align: align.Right,
						Top:   10,
					},
				),
				text.New(
					"Goods & Services Tax Number : "+company.GSTNumber+"\nUdyam Registration [MSME] : "+company.PANNumber+"\n"+company.Phone+" | "+company.Email,
					props.Text{
						Size:  9,
						Align: align.Right,
						Top:   17,
						Style: fontstyle.Bold,
					},
				),
			),
		),
	)

	m.AddRows(row.New(5))

	// 2. QUOTATION TITLE
	m.AddRows(
		row.New(20).Add(
			col.New(6).Add(
				text.New("QUOTATION", props.Text{Style: fontstyle.Bold, Size: 14}),
				text.New(doc.DocumentNumber, props.Text{Style: fontstyle.Bold, Size: 11, Top: 6}),
				text.New(doc.DocumentDate.Format("02th January 2006"), props.Text{Style: fontstyle.Bold, Size: 11, Top: 12}),
			),
		),
	)

	m.AddRows(row.New(5))

	// 3. TO & DETAILS GRID
	// Row 1
	m.AddRows(
		row.New(5).Add(
			col.New(6).Add(text.New("To,", props.Text{Size: 10})),
			col.New(2).Add(text.New("Your Order No.", props.Text{Size: 9, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
			col.New(4).Add(text.New(doc.OrderNumber, props.Text{Size: 9, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
		),
	)

	orderDateStr := ""
	if doc.OrderDate != nil {
		orderDateStr = doc.OrderDate.Format("02/01/2006")
	}

	// Row 2
	m.AddRows(
		row.New(5).Add(
			col.New(6).Add(text.New(client.Name, props.Text{Style: fontstyle.Bold, Size: 10})),
			col.New(2).Add(text.New("Dated", props.Text{Size: 9, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
			col.New(4).Add(text.New(orderDateStr, props.Text{Size: 9, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
		),
	)

	// Row 3
	m.AddRows(
		row.New(5).Add(
			col.New(6).Add(text.New(client.Organisation+", "+client.Address, props.Text{Size: 10})),
			col.New(2).Add(text.New("Email", props.Text{Size: 9, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
			col.New(4).Add(text.New(client.Email, props.Text{Size: 9, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
		),
	)

	// Row 4
	m.AddRows(
		row.New(5).Add(
			col.New(6).Add(text.New(client.City+", "+client.State+" India - "+client.Country, props.Text{Size: 10})),
			col.New(2).Add(text.New("Other Details", props.Text{Size: 9, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
			col.New(4).Add(text.New(doc.Remarks, props.Text{Size: 9, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
		),
	)

	m.AddRows(
		row.New(5).Add(
			col.New(6).Add(text.New("GST Number : "+client.GSTNumber, props.Text{Style: fontstyle.Bold, Size: 10})),
		),
	)

	m.AddRows(row.New(5))

	// 4. MAIN TABLE HEADER
	headerStyle := &props.Cell{BackgroundColor: headerBgColor, BorderType: border.Full, BorderThickness: 0.2}
	textHeaderStyle := props.Text{Style: fontstyle.Bold, Size: 10, Align: align.Center, Top: 2}

	m.AddRows(
		row.New(8).Add(
			col.New(1).Add(text.New("S. No", textHeaderStyle)).WithStyle(headerStyle),
			col.New(5).Add(text.New("Software Licensing Services", props.Text{Style: fontstyle.Bold, Size: 10, Align: align.Center, Top: 2})).WithStyle(headerStyle),
			col.New(1).Add(text.New("Qty", textHeaderStyle)).WithStyle(headerStyle),
			col.New(2).Add(text.New("Rate", textHeaderStyle)).WithStyle(headerStyle),
			col.New(1).Add(text.New("Per", textHeaderStyle)).WithStyle(headerStyle),
			col.New(2).Add(text.New("Total", textHeaderStyle)).WithStyle(headerStyle),
		),
	)

	// 5. MAIN TABLE ITEMS
	for _, item := range doc.Items {
		itemStyle := &props.Cell{BorderType: border.Full, BorderThickness: 0.2}
		
		desc := item.SoftwareName + "\n" + item.Description + "\nHSN Code : " + item.HSNCode
		qtyStr := fmt.Sprintf("%d\n(%s)", item.Quantity, item.Unit)

		m.AddRows(
			row.New(24).Add(
				col.New(1).Add(text.New(fmt.Sprintf("%d", item.SerialNo), props.Text{Align: align.Center, Size: 10, Top: 2})).WithStyle(itemStyle),
				col.New(5).Add(text.New(desc, props.Text{Size: 10, Top: 2, Left: 1, Style: fontstyle.Bold})).WithStyle(itemStyle),
				col.New(1).Add(text.New(qtyStr, props.Text{Align: align.Center, Size: 10, Top: 2})).WithStyle(itemStyle),
				col.New(2).Add(text.New(item.Rate.StringFixed(2), props.Text{Align: align.Right, Size: 10, Top: 2, Right: 1})).WithStyle(itemStyle),
				col.New(1).Add(text.New("--", props.Text{Align: align.Center, Size: 10, Top: 2})).WithStyle(itemStyle),
				col.New(2).Add(text.New(item.Total.StringFixed(2), props.Text{Align: align.Right, Size: 10, Top: 2, Right: 1})).WithStyle(itemStyle),
			),
		)
	}

	// 6. FOOTER GRID (Terms and Totals side by side)
	// Because of Maroto limitations with nested grids, we draw the rows manually and rely on `WithStyle` for borders.
	// We'll create 6 rows. The left 8 cols will just have 1 border spanning them all if possible, or we just draw text.
	// Actually, giving `BorderType: border.Full` to multiple stacked rows creates lines between them. 
	// To avoid horizontal lines on the left, we can use `border.Left | border.Right` for middle rows.
	
	// Let's just create a single row for the terms, and for totals, we can't easily side-by-side them unless we break it down line by line.
	// Line 1:
	m.AddRows(
		row.New(6).Add(
			col.New(8).Add(text.New("Commercial Terms & Conditions:", props.Text{Size: 8, Top: 1, Left: 1, Style: fontstyle.Bold})).WithStyle(&props.Cell{BorderType: border.Left | border.Top | border.Right, BorderThickness: 0.2}),
			col.New(2).Add(text.New("Sub Total", props.Text{Size: 9, Top: 1, Align: align.Center, Style: fontstyle.Bold})).WithStyle(&props.Cell{BackgroundColor: headerBgColor, BorderType: border.Full, BorderThickness: 0.2}),
			col.New(2).Add(text.New(doc.Subtotal.StringFixed(2), props.Text{Size: 9, Top: 1, Align: align.Right, Right: 1, Style: fontstyle.Bold})).WithStyle(&props.Cell{BackgroundColor: headerBgColor, BorderType: border.Full, BorderThickness: 0.2}),
		),
	)

	// Line 2:
	m.AddRows(
		row.New(6).Add(
			col.New(8).Add(text.New("- Quotation Validity: 30 days", props.Text{Size: 8, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Left | border.Right, BorderThickness: 0.2}),
			col.New(2).Add(text.New("Shipping | Installation", props.Text{Size: 8, Top: 1, Align: align.Center})).WithStyle(&props.Cell{BackgroundColor: headerBgColor, BorderType: border.Full, BorderThickness: 0.2}),
			col.New(2).Add(text.New("( - ) "+doc.Shipping.StringFixed(2), props.Text{Size: 9, Top: 1, Align: align.Right, Right: 1})).WithStyle(&props.Cell{BackgroundColor: headerBgColor, BorderType: border.Full, BorderThickness: 0.2}),
		),
	)

	// Line 3:
	m.AddRows(
		row.New(6).Add(
			col.New(8).Add(text.New("- Payment Terms: 100% advance against with Purchase Order.", props.Text{Size: 8, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Left | border.Right, BorderThickness: 0.2}),
			col.New(2).Add(text.New("IGST", props.Text{Size: 9, Top: 1, Align: align.Right, Right: 1})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
			col.New(2).Add(text.New(doc.IGST.StringFixed(2), props.Text{Size: 9, Top: 1, Align: align.Right, Right: 1})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
		),
	)

	// Line 4:
	m.AddRows(
		row.New(6).Add(
			col.New(8).Add(text.New("- Delivery: Electronic Software Delivery (ESD) via email within FIVE", props.Text{Size: 8, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Left | border.Right, BorderThickness: 0.2}),
			col.New(2).Add(text.New("CGST", props.Text{Size: 9, Top: 1, Align: align.Right, Right: 1})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
			col.New(2).Add(text.New(doc.CGST.StringFixed(2), props.Text{Size: 9, Top: 1, Align: align.Right, Right: 1})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
		),
	)

	// Line 5:
	m.AddRows(
		row.New(6).Add(
			col.New(8).Add(text.New("  business days of receipt of payment.", props.Text{Size: 8, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Left | border.Right, BorderThickness: 0.2}),
			col.New(2).Add(text.New("SGST", props.Text{Size: 9, Top: 1, Align: align.Right, Right: 1})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
			col.New(2).Add(text.New(doc.SGST.StringFixed(2), props.Text{Size: 9, Top: 1, Align: align.Right, Right: 1})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
		),
	)

	// Line 6:
	m.AddRows(
		row.New(6).Add(
			col.New(8).Add(text.New("- Taxes: GST @ 18% or as applicable at the time of Invoicing.", props.Text{Size: 8, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Left | border.Right, BorderThickness: 0.2}),
			col.New(2).Add(text.New("Grand Total", props.Text{Size: 9, Top: 1, Align: align.Center, Style: fontstyle.Bold})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
			col.New(2).Add(text.New(doc.GrandTotal.StringFixed(2), props.Text{Size: 9, Top: 1, Align: align.Right, Right: 1, Style: fontstyle.Bold})).WithStyle(&props.Cell{BorderType: border.Full, BorderThickness: 0.2}),
		),
	)

	// Line 7:
	m.AddRows(
		row.New(6).Add(
			col.New(8).Add(text.New("- Support: Includes OEM portal-based support.", props.Text{Size: 8, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Left | border.Right, BorderThickness: 0.2}),
			col.New(4).Add(text.New("Amount in words", props.Text{Size: 9, Top: 1, Align: align.Center})).WithStyle(&props.Cell{BorderType: border.Left | border.Top | border.Right, BorderThickness: 0.2}),
		),
	)

	// Line 8:
	m.AddRows(
		row.New(6).Add(
			col.New(8).Add(text.New("- Installation: Onsite/offline installation & support is not included.", props.Text{Size: 8, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Left | border.Right, BorderThickness: 0.2}),
			col.New(4).Add(text.New(doc.AmountInWords, props.Text{Size: 9, Top: 1, Align: align.Center})).WithStyle(&props.Cell{BorderType: border.Left | border.Right, BorderThickness: 0.2}),
		),
	)

	// Line 9:
	m.AddRows(
		row.New(6).Add(
			col.New(8).Add(text.New("- Subject to DELHI JURISDICTION", props.Text{Size: 8, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Left | border.Right, BorderThickness: 0.2}),
			col.New(4).Add().WithStyle(&props.Cell{BorderType: border.Left | border.Right, BorderThickness: 0.2}),
		),
	)

	// Line 10 (Spacer inside left)
	m.AddRows(
		row.New(6).Add(
			col.New(8).Add().WithStyle(&props.Cell{BorderType: border.Left | border.Right, BorderThickness: 0.2}),
			col.New(4).Add(text.New("For MILLENNIUM SYSTEMS", props.Text{Size: 10, Top: 1, Align: align.Center, Style: fontstyle.Bold})).WithStyle(&props.Cell{BorderType: border.Left | border.Right, BorderThickness: 0.2}),
		),
	)

	// Line 11 (Enclosures)
	m.AddRows(
		row.New(6).Add(
			col.New(8).Add(text.New("Enclosures:", props.Text{Size: 8, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Left | border.Right, BorderThickness: 0.2}),
			col.New(4).Add().WithStyle(&props.Cell{BorderType: border.Left | border.Right, BorderThickness: 0.2}),
		),
	)
	
	// Line 12
	m.AddRows(
		row.New(12).Add(
			col.New(8).Add(text.New("PAN | GST | MSME | Dealership Letter", props.Text{Size: 8, Top: 1, Left: 1})).WithStyle(&props.Cell{BorderType: border.Left | border.Right | border.Bottom, BorderThickness: 0.2}),
			col.New(4).Add(text.New("Authorized Signatory", props.Text{Size: 10, Top: 6, Align: align.Right, Right: 2})).WithStyle(&props.Cell{BorderType: border.Left | border.Right | border.Bottom, BorderThickness: 0.2}),
		),
	)

	m.AddRows(row.New(10)) // Spacer

	// 7. FOOTER LOGOS
	m.AddRows(
		row.New(15).Add(
			col.New(2).Add(image.NewFromFile("assets/AtlasLogo.png", props.Rect{Center: true, Percent: 100})),
			col.New(3).Add(image.NewFromFile("assets/MaxqdaLogo.png", props.Rect{Center: true, Percent: 100})),
			col.New(2).Add(image.NewFromFile("assets/SmartLogo.png", props.Rect{Center: true, Percent: 100})),
			col.New(2).Add(image.NewFromFile("assets/NovaPDF.png", props.Rect{Center: true, Percent: 100})),
			col.New(3).Add(image.NewFromFile("assets/QuestionProLogo.png", props.Rect{Center: true, Percent: 100})),
		),
	)

	docGen, err := m.Generate()
	if err != nil {
		return nil, err
	}

	return docGen.GetBytes(), nil
}
