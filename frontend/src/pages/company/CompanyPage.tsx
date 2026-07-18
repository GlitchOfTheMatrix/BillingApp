import { useEffect, useState } from "react";

import CompanyForm from "../../features/company/components/CompanyForm/CompanyForm";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany,
} from "../../features/company/api/companyApi";
import type { CompanyDetails } from "../../features/company/types";
import type { CompanyFormValues } from "../../features/company/schemas/companySchema";

export default function CompanyPage() {
  const [company, setCompany] = useState<CompanyDetails | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCompany();
  }, []);

  async function loadCompany() {
    try {
      const response = await getCompanies();

      setCompany(response.data[0] ?? null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(values: CompanyFormValues) {
    try {
      setSaving(true);

      if (company) {
        await updateCompany(company.id, values);
      } else {
        await createCompany(values);
      }

      await loadCompany();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!company) {
      return;
    }

    await deleteCompany(company.id);

    setCompany(null);
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <h1>Company Details</h1>

      <CompanyForm
        initialData={company ?? undefined}
        isSubmitting={saving}
        onSubmit={handleSubmit}
      />

      {company && <button onClick={handleDelete}>Delete Company</button>}
    </>
  );
}
