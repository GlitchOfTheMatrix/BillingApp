import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  clientSchema,
  type ClientFormValues,
} from "../../schemas/clientSchema";
import type { Client } from "../../types";
import FormField from "../../../../components/common/FormField/FormField";
import Button from "../../../../components/common/Button/Button";
import styles from "./ClientForm.module.css";

interface Props {
  readonly initialData?: Client;
  readonly onSubmit: (values: ClientFormValues) => Promise<void>;
  readonly onCancel?: () => void;
}

const EMPTY_VALUES: ClientFormValues = {
  name: "",
  organisation: "",
  address: "",
  city: "",
  state: "",
  country: "",
  gst_number: "",
  email: "",
  phone: "",
};

export default function ClientForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset(EMPTY_VALUES);
    }
  }, [initialData, reset]);

  async function onFormSubmit(values: ClientFormValues) {
    await onSubmit(values);
    if (!initialData) {
      reset(EMPTY_VALUES);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onFormSubmit)}>
      <FormField label="Name" htmlFor="client-name" error={errors.name?.message} required>
        <input id="client-name" placeholder="Client name" {...register("name")} />
      </FormField>

      <FormField label="Organisation" htmlFor="client-org" error={errors.organisation?.message}>
        <input id="client-org" placeholder="Company / Organisation" {...register("organisation")} />
      </FormField>

      <FormField label="Email" htmlFor="client-email" error={errors.email?.message}>
        <input id="client-email" type="email" placeholder="client@example.com" {...register("email")} />
      </FormField>

      <FormField label="Phone" htmlFor="client-phone" error={errors.phone?.message}>
        <input id="client-phone" placeholder="+91 98765 43210" {...register("phone")} />
      </FormField>

      <FormField label="GST Number" htmlFor="client-gst" error={errors.gst_number?.message}>
        <input id="client-gst" placeholder="22AAAAA0000A1Z5" {...register("gst_number")} />
      </FormField>

      <FormField label="City" htmlFor="client-city" error={errors.city?.message}>
        <input id="client-city" placeholder="City" {...register("city")} />
      </FormField>

      <FormField label="State" htmlFor="client-state" error={errors.state?.message}>
        <input id="client-state" placeholder="State" {...register("state")} />
      </FormField>

      <FormField label="Country" htmlFor="client-country" error={errors.country?.message}>
        <input id="client-country" placeholder="Country" {...register("country")} />
      </FormField>

      <div className={styles.fullWidth}>
        <FormField label="Address" htmlFor="client-address" error={errors.address?.message}>
          <textarea id="client-address" placeholder="Full address" {...register("address")} />
        </FormField>
      </div>

      <div className={styles.actions}>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? "Update Client" : "Add Client"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
