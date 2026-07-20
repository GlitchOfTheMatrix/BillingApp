import { useNavigate } from "react-router-dom";

import DocumentForm from "../../features/documents/components/DocumentForm/DocumentForm";
import { createDocument } from "../../features/documents/api/documentApi";
import type { DocumentFormValues } from "../../features/documents/schemas/documentSchema";
import { ROUTES } from "../../app/router/routes";

export default function CreateDocumentPage() {
  const navigate = useNavigate();

  async function handleSubmit(values: DocumentFormValues) {
    await createDocument(values);

    navigate(ROUTES.DOCUMENTS);
  }

  return <DocumentForm onSubmit={handleSubmit} />;
}
