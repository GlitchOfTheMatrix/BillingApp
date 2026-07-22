import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CompanyForm from "../../features/company/components/CompanyForm/CompanyForm";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany,
} from "../../features/company/api/companyApi";
import type { CompanyDetails, CompanyPayload } from "../../features/company/types";
import type { CompanyFormValues } from "../../features/company/schemas/companySchema";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import Button from "../../components/common/Button/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import { useLoader } from "../../contexts/LoaderContext";

export default function CompanyPage() {
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    loadCompany();
  }, []);

  async function loadCompany() {
    try {
      showLoader();
      const response = await getCompanies();
      setCompany(response.data?.[0] ?? null);
    } catch {
      toast.error("Failed to load company details.");
    } finally {
      hideLoader();
    }
  }

  async function handleSubmit(values: CompanyFormValues) {
    try {
      showLoader();

      const payload: CompanyPayload = {
        ...values,
        email: values.email ?? "",
      };

      if (company) {
        await updateCompany(company.id, payload);
        toast.success("Company details updated successfully");
      } else {
        await createCompany(payload);
        toast.success("Company details saved successfully");
      }

      await loadCompany();
    } catch {
      toast.error("Failed to save company details.");
      hideLoader();
    }
  }

  async function handleDeleteConfirm() {
    if (!company) return;
    try {
      showLoader();
      await deleteCompany(company.id);
      toast.success("Company details deleted");
      setCompany(null);
      setDeleteDialogOpen(false);
    } catch {
      toast.error("Failed to delete company details.");
    } finally {
      hideLoader();
    }
  }

  return (
    <>
      <PageHeader title="Company Details" subtitle="Manage your business information">
        {company && (
          <Button variant="danger" size="sm" onClick={() => setDeleteDialogOpen(true)}>
            Delete Company
          </Button>
        )}
      </PageHeader>

      <CompanyForm
        initialData={company ?? undefined}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Company Details"
        message="Are you sure you want to delete all company details? This will remove your business information from all documents."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
}
