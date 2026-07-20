import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  clientSchema,
  type ClientFormValues,
} from "../../schemas/clientSchema";
import type { Client } from "../../types";
import styles from "./ClientForm.module.css";

interface Props {
  readonly initialData?: Client;
  readonly isSubmitting: boolean;
  readonly onSubmit: (values: ClientFormValues) => Promise<void>;
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
  isSubmitting,
  onSubmit,
}: Props) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),

    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Name" {...register("name")} />

      <input placeholder="Organisation" {...register("organisation")} />

      <textarea placeholder="Address" {...register("address")} />

      <input placeholder="City" {...register("city")} />

      <input placeholder="State" {...register("state")} />

      <input placeholder="Country" {...register("country")} />

      <input placeholder="GST Number" {...register("gst_number")} />

      <input placeholder="Email" {...register("email")} />

      <input placeholder="Phone" {...register("phone")} />

      {errors.name && <p>{errors.name.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        Save
      </button>
    </form>
  );
}
