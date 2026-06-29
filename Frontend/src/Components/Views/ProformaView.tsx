import type { QuotationDocument } from "../../types";

interface ProformaViewProps {
  quotations: QuotationDocument[];
  onGenerateProforma: (id: string) => void;
}

export default function ProformaView({
  quotations,
  onGenerateProforma,
}: ProformaViewProps) {
  return (
    <div>
      <h2>Proforma Invoices</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Select a generated quotation to create its Proforma Invoice.
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#e9ecef", textAlign: "left" }}>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
              Quotation ID
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
                  onClick={() => onGenerateProforma(q.id)}
                  style={{
                    background: "#17a2b8",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  Generate Proforma Invoice
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
                No quotations available. Generate a quotation first.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
