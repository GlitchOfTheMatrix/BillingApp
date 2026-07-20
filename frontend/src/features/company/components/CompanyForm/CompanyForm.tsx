import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  companySchema,
  type CompanyFormValues,
} from "../../schemas/companySchema";
import type { CompanyDetails } from "../../types";
import FormField from "../../../../components/common/FormField/FormField";
import Button from "../../../../components/common/Button/Button";
import styles from "./CompanyForm.module.css";

interface Props {
  readonly initialData?: CompanyDetails;
  readonly onSubmit: (values: CompanyFormValues) => Promise<void>;
}

const EMPTY_VALUES: CompanyFormValues = {
  company_name: "",
  gst_number: "",
  pan_number: "",
  msme_number: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  bank_name: "",
  account_number: "",
  ifsc_code: "",
  branch: "",
};

export default function CompanyForm({
  initialData,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Company Name" htmlFor="co-name" error={errors.company_name?.message} required>
        <input id="co-name" placeholder="Your business name" {...register("company_name")} />
      </FormField>

      <FormField label="GST Number" htmlFor="co-gst" error={errors.gst_number?.message}>
        <input id="co-gst" placeholder="22AAAAA0000A1Z5" {...register("gst_number")} />
      </FormField>

      <FormField label="PAN Number" htmlFor="co-pan" error={errors.pan_number?.message}>
        <input id="co-pan" placeholder="AAAAA0000A" {...register("pan_number")} />
      </FormField>

      <FormField label="MSME Number" htmlFor="co-msme" error={errors.msme_number?.message}>
        <input id="co-msme" placeholder="UDYAM-XX-00-0000000" {...register("msme_number")} />
      </FormField>

      <FormField label="Phone" htmlFor="co-phone" error={errors.phone?.message}>
        <input id="co-phone" placeholder="+91 98765 43210" {...register("phone")} />
      </FormField>

      <FormField label="Email" htmlFor="co-email" error={errors.email?.message}>
        <input id="co-email" type="email" placeholder="company@example.com" {...register("email")} />
      </FormField>

      <FormField label="Website" htmlFor="co-website" error={errors.website?.message}>
        <input id="co-website" placeholder="https://example.com" {...register("website")} />
      </FormField>

      <div className={styles.fullWidth}>
        <FormField label="Address" htmlFor="co-address" error={errors.address?.message}>
          <textarea id="co-address" placeholder="Full business address" {...register("address")} />
        </FormField>
      </div>

      <h3 className={styles.sectionDivider}>Bank Details</h3>

      <FormField label="Bank Name" htmlFor="co-bank" error={errors.bank_name?.message}>
        <input id="co-bank" placeholder="Bank name" {...register("bank_name")} />
      </FormField>

      <FormField label="Account Number" htmlFor="co-account" error={errors.account_number?.message}>
        <input id="co-account" placeholder="Account number" {...register("account_number")} />
      </FormField>

      <FormField label="IFSC Code" htmlFor="co-ifsc" error={errors.ifsc_code?.message}>
        <input id="co-ifsc" placeholder="SBIN0001234" {...register("ifsc_code")} />
      </FormField>

      <FormField label="Branch" htmlFor="co-branch" error={errors.branch?.message}>
        <input id="co-branch" placeholder="Branch name" {...register("branch")} />
      </FormField>

      <div className={styles.actions}>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? "Update Details" : "Save Details"}
        </Button>
      </div>
    </form>
  );
}
