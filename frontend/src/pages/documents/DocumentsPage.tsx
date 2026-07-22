import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { ROUTES } from "../../app/router/routes";
import {
  deleteDocument,
  getDocuments,
  downloadDocumentPDF,
  duplicateDocument,
  generateDocumentFromSource,
} from "../../features/documents/api/documentApi";
import type { Document, DocumentStatus, DocumentType } from "../../features/documents/types";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination/Pagination";
import SearchBar from "../../components/common/SearchBar/SearchBar";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import Card, { CardHeader, CardActions } from "../../components/common/Card/Card";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import Button from "../../components/common/Button/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import { useLoader } from "../../contexts/LoaderContext";
import styles from "./DocumentsPage.module.css";

const STATUS_CLASSES: Record<DocumentStatus, string> = {
  draft: styles.statusDraft,
  sent: styles.statusSent,
  accepted: styles.statusAccepted,
  paid: styles.statusPaid,
  cancelled: styles.statusCancelled,
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null);
  const { showLoader, hideLoader } = useLoader();

  const {
    page,
    searchInput,
    debouncedSearch,
    handleSearchChange,
    handlePageChange,
    getPaginationParams,
  } = usePagination();

  useEffect(() => {
    loadDocuments();
  }, [page, debouncedSearch]);

  async function loadDocuments() {
    try {
      showLoader();
      const response = await getDocuments(getPaginationParams());
      setDocuments(response.data ?? []);
      setTotalPages(response.total_pages || 1);
    } catch {
      toast.error("Failed to load documents.");
    } finally {
      hideLoader();
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      showLoader();
      await deleteDocument(deleteTarget.id);
      toast.success("Document deleted successfully");
      setDeleteTarget(null);
      await loadDocuments();
    } catch {
      toast.error("Failed to delete document.");
      hideLoader();
    }
  }

  async function handleDownloadPDF(id: string, documentNumber: string) {
    try {
      showLoader();
      await downloadDocumentPDF(id, documentNumber);
      toast.success("PDF downloaded successfully");
    } catch {
      toast.error("Failed to download PDF.");
    } finally {
      hideLoader();
    }
  }

  async function handleDuplicate(id: string) {
    try {
      showLoader();
      await duplicateDocument(id);
      toast.success("Document duplicated successfully");
      await loadDocuments();
    } catch {
      toast.error("Failed to duplicate document.");
      hideLoader();
    }
  }

  async function handleGenerate(id: string, targetType: DocumentType) {
    try {
      showLoader();
      await generateDocumentFromSource(id, targetType);
      toast.success(`Generated ${targetType.replace("_", " ")} successfully`);
      await loadDocuments();
    } catch {
      toast.error(`Failed to generate ${targetType.replace("_", " ")}.`);
      hideLoader();
    }
  }

  return (
    <>
      <PageHeader title="Documents">
        <SearchBar
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search documents..."
        />
        <Link to={ROUTES.CREATE_DOCUMENT}>
          <Button>Create Document</Button>
        </Link>
      </PageHeader>

      {documents.length === 0 ? (
        <EmptyState
          icon="📄"
          title="No documents found"
          message="Create your first invoice, quotation, or proforma."
        >
          <Link to={ROUTES.CREATE_DOCUMENT}>
            <Button>Create Document</Button>
          </Link>
        </EmptyState>
      ) : (
        <div className={styles.listGrid}>
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader
                title={doc.document_number}
                subtitle={doc.document_type.replace("_", " ")}
              />
              <div className={styles.docMeta}>
                <span className={`${styles.statusBadge} ${STATUS_CLASSES[doc.status]}`}>
                  {doc.status}
                </span>
                <span className={styles.total}>₹{doc.grand_total}</span>
              </div>
              <CardActions>
                <Link to={`/documents/${doc.id}/edit`}>
                  <Button variant="secondary" size="sm">Edit</Button>
                </Link>

                {/* Document Flow Generation */}
                {doc.document_type === "quotation" && (
                  <Button variant="primary" size="sm" onClick={() => handleGenerate(doc.id, "proforma")}>
                    Generate Proforma Invoice
                  </Button>
                )}
                {doc.document_type === "proforma" && (
                  <Button variant="primary" size="sm" onClick={() => handleGenerate(doc.id, "tax_invoice")}>
                    Generate Tax Invoice
                  </Button>
                )}

                {/* View Linked Document */}
                {doc.document_type === "proforma" && doc.source_document_id && (
                  <Link to={`/documents/${doc.source_document_id}/view`}>
                    <Button variant="secondary" size="sm">View Quotation</Button>
                  </Link>
                )}
                {doc.document_type === "tax_invoice" && doc.source_document_id && (
                  <Link to={`/documents/${doc.source_document_id}/view`}>
                    <Button variant="secondary" size="sm">View Proforma Invoice</Button>
                  </Link>
                )}

                <Button variant="secondary" size="sm" onClick={() => handleDuplicate(doc.id)}>
                  Duplicate
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleDownloadPDF(doc.id, doc.document_number)}>
                  PDF
                </Button>
                <Button variant="danger" size="sm" onClick={() => setDeleteTarget(doc)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      )}

      {documents.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Document"
        message={`Are you sure you want to delete document "${deleteTarget?.document_number}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
