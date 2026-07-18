import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  companySchema,
  type CompanyFormValues,
} from "../../schemas/companySchema";
import type { CompanyDetails } from "../../types";
import styles from "./CompanyForm.module.css";

interface Props {
  readonly initialData?: CompanyDetails;
  readonly isSubmitting: boolean;
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
  isSubmitting,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
      <input placeholder="Company Name" {...register("company_name")} />

      <input placeholder="GST Number" {...register("gst_number")} />

      <input placeholder="PAN Number" {...register("pan_number")} />

      <input placeholder="MSME Number" {...register("msme_number")} />

      <textarea placeholder="Address" {...register("address")} />

      <input placeholder="Phone" {...register("phone")} />

      <input placeholder="Email" {...register("email")} />

      <input placeholder="Website" {...register("website")} />

      <input placeholder="Bank Name" {...register("bank_name")} />

      <input placeholder="Account Number" {...register("account_number")} />

      <input placeholder="IFSC Code" {...register("ifsc_code")} />

      <input placeholder="Branch" {...register("branch")} />

      {errors.company_name && <p>{errors.company_name.message}</p>}

      <button disabled={isSubmitting} type="submit">
        Save
      </button>
    </form>
  );
}
