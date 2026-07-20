import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import DocumentForm from "../../features/documents/components/DocumentForm/DocumentForm";
import { createDocument } from "../../features/documents/api/documentApi";
import type { DocumentFormValues } from "../../features/documents/schemas/documentSchema";
import { ROUTES } from "../../app/router/routes";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import { useLoader } from "../../contexts/LoaderContext";

export default function CreateDocumentPage() {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  async function handleSubmit(values: DocumentFormValues) {
    try {
      showLoader();
      await createDocument(values);
      toast.success("Document created successfully");
      navigate(ROUTES.DOCUMENTS);
    } catch {
      toast.error("Failed to create document.");
      hideLoader();
    }
  }

  return (
    <>
      <PageHeader title="Create Document" />
      <DocumentForm onSubmit={handleSubmit} />
    </>
  );
}
