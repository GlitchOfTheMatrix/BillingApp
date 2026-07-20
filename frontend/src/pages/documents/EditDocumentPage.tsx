import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import DocumentForm from "../../features/documents/components/DocumentForm/DocumentForm";
import {
  getDocumentById,
  updateDocument,
} from "../../features/documents/api/documentApi";
import type { Document } from "../../features/documents/types";
import type { DocumentFormValues } from "../../features/documents/schemas/documentSchema";
import { ROUTES } from "../../app/router/routes";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import { useLoader } from "../../contexts/LoaderContext";

export default function EditDocumentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  const [document, setDocument] = useState<Document>();
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadDocument() {
      try {
        showLoader();
        const data = await getDocumentById(id!);
        setDocument(data);
      } catch {
        setLoadError(true);
        toast.error("Failed to load document.");
      } finally {
        hideLoader();
      }
    }

    loadDocument();
  }, [id]);

  async function handleSubmit(values: DocumentFormValues) {
    if (!id) return;

    try {
      showLoader();
      await updateDocument(id, values);
      toast.success("Document updated successfully");
      navigate(ROUTES.DOCUMENTS);
    } catch {
      toast.error("Failed to update document.");
      hideLoader();
    }
  }

  if (loadError) {
    return (
      <>
        <PageHeader title="Edit Document" />
        <p>Could not load this document. It may have been deleted.</p>
      </>
    );
  }

  if (!document) {
    return null; // global loader is showing
  }

  return (
    <>
      <PageHeader title="Edit Document" subtitle={document.document_number} />
      <DocumentForm initialData={document} onSubmit={handleSubmit} />
    </>
  );
}
