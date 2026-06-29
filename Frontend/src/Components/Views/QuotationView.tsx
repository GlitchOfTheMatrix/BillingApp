import type { QuotationDocument } from "../../types";

interface QuotationViewProps {
  quotations: QuotationDocument[];
  onGenerateNew: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function QuotationView({
  quotations,
  onGenerateNew,
  onEdit,
  onDelete,
}: QuotationViewProps) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Quotations</h2>
        <button
          onClick={onGenerateNew}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Generate New Quotation
        </button>
      </div>

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
                  onClick={() => onEdit(q.id)}
                  style={{
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "3px",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                >
                  Edit / View
                </button>
                <button
                  onClick={() => onDelete(q.id)}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  Delete
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
                No quotations generated yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
