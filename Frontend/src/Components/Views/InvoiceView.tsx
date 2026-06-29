import type { QuotationDocument } from "../../types";

interface InvoiceViewProps {
  quotations: QuotationDocument[];
  onGenerateInvoice: (id: string) => void;
}

export default function InvoiceView({
  quotations,
  onGenerateInvoice,
}: InvoiceViewProps) {
  return (
    <div>
      <h2>Invoices</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Select a generated Proforma Invoice to create its Tax Invoice.
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#e9ecef", textAlign: "left" }}>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
              Proforma ID
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
              Date
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
              Client
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
              Amount
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {quotations.map((q) => (
            <tr key={q.id}>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {q.id}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {q.date}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {q.clientName}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {q.amount}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                <button
                  onClick={() => onGenerateInvoice(q.id)}
                  style={{
                    background: "#ffc107",
                    color: "black",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Generate Invoice
                </button>
              </td>
            </tr>
          ))}
          {quotations.length === 0 && (
            <tr>
              <td
                colSpan={5}
                style={{ padding: "20px", textAlign: "center", color: "#666" }}
              >
                No proforma invoices available. Generate one first.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
