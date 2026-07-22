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
      
      const payload: any = { ...values };
      
      if (payload.document_date) {
        payload.document_date = new Date(payload.document_date).toISOString();
      }
      
      if (payload.order_date) {
        payload.order_date = new Date(payload.order_date).toISOString();
      } else {
        payload.order_date = null;
      }

      await createDocument(payload);
      toast.success("Document created successfully");
      navigate(ROUTES.DOCUMENTS);
    } catch (error: any) {
      const msg = error?.response?.data?.error || JSON.stringify(error?.response?.data?.errors) || "Failed to create document.";
      toast.error(msg);
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
