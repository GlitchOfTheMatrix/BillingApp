import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import Button from "../../components/common/Button/Button";
import Card, { CardHeader } from "../../components/common/Card/Card";
import { getDocumentById } from "../../features/documents/api/documentApi";
import type { Document } from "../../features/documents/types";
import { useLoader } from "../../contexts/LoaderContext";

export default function ViewDocumentPage() {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (id) {
      loadDocument(id);
    }
  }, [id]);

  async function loadDocument(docId: string) {
    try {
      showLoader();
      const response = await getDocumentById(docId);
      setDocument(response);
    } catch {
      toast.error("Failed to load document details.");
    } finally {
      hideLoader();
    }
  }

  if (!document) {
    return null; // or a loading spinner if loader context isn't enough
  }

  return (
    <>
      <PageHeader title={`View Document: ${document.document_number}`}>
        <Link to={`/documents/${document.id}/edit`}>
          <Button variant="primary">Edit Document</Button>
        </Link>
      </PageHeader>

      <Card>
        <CardHeader title="Document Information" />
        <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <strong>Type:</strong> <span style={{textTransform: "capitalize"}}>{document.document_type.replace("_", " ")}</span>
          </div>
          <div>
            <strong>Status:</strong> <span style={{textTransform: "capitalize"}}>{document.status}</span>
          </div>
          <div>
            <strong>Date:</strong> {new Date(document.document_date).toLocaleDateString()}
          </div>
          <div>
            <strong>Grand Total:</strong> ₹{document.grand_total}
          </div>
        </div>
      </Card>

      <div style={{ marginTop: "2rem" }}>
        <h3>Items</h3>
        <Card>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <th style={{ padding: "1rem" }}>Software Name</th>
                  <th style={{ padding: "1rem" }}>Qty</th>
                  <th style={{ padding: "1rem" }}>Rate</th>
                  <th style={{ padding: "1rem" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {document.items.map((item, index) => (
                  <tr key={item.id || index} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "1rem" }}>{item.software_name}</td>
                    <td style={{ padding: "1rem" }}>{item.quantity}</td>
                    <td style={{ padding: "1rem" }}>₹{item.rate}</td>
                    <td style={{ padding: "1rem" }}>₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
