import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DocumentForm from "../../features/documents/components/DocumentForm/DocumentForm";
import {
  getDocumentById,
  updateDocument,
} from "../../features/documents/api/documentApi";
import type { Document } from "../../features/documents/types";
import type { DocumentFormValues } from "../../features/documents/schemas/documentSchema";

export default function EditDocumentPage() {
  const { id } = useParams();

  const [document, setDocument] = useState<Document>();

  useEffect(() => {
    if (!id) {
      return;
    }

    getDocumentById(id).then(setDocument);
  }, [id]);

  async function handleSubmit(values: DocumentFormValues) {
    if (!id) {
      return;
    }

    await updateDocument(id, values);
  }

  if (!document) {
    return <p>Loading...</p>;
  }

  return <DocumentForm initialData={document} onSubmit={handleSubmit} />;
}
