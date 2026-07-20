import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../app/router/routes";
import {
  deleteDocument,
  getDocuments,
} from "../../features/documents/api/documentApi";
import type { Document } from "../../features/documents/types";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      setLoading(true);

      setError("");

      const response = await getDocuments();

      setDocuments(response.data ?? []);
    } catch {
      setError("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteDocument(id);

      setDocuments((prev) => prev.filter((document) => document.id !== id));
    } catch {
      setError("Failed to delete document.");
    }
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <h1>Documents</h1>

        <Link to={ROUTES.CREATE_DOCUMENT}>Create Document</Link>
      </div>

      {error && <p>{error}</p>}

      {documents.length === 0 && <p>No documents found.</p>}

      {documents.map((document) => (
        <div
          key={document.id}
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "8px",
          }}
        >
          <h3>{document.document_number}</h3>

          <p>Type: {document.document_type}</p>

          <p>Status: {document.status}</p>

          <p>Total: ₹{document.grand_total}</p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <Link to={`/documents/${document.id}/edit`}>Edit</Link>

            <button onClick={() => handleDelete(document.id)}>Delete</button>
          </div>
        </div>
      ))}
    </>
  );
}
