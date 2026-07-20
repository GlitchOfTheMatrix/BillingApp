import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Document } from "../../types";
import {
  documentSchema,
  type DocumentFormValues,
} from "../../schemas/documentSchema";
import { EMPTY_DOCUMENT } from "../../constants";
import DocumentItemRow from "../DocumentItemRow/DocumentItemRow";
import TotalsPanel from "../TotalsPanel/TotalsPanel";
import { calculateItemTotal, calculateTotals } from "../../utils";

interface Props {
  readonly initialData?: Document;
  readonly onSubmit: (data: DocumentFormValues) => Promise<void>;
}

export default function DocumentForm({ initialData, onSubmit }: Props) {
  const { control, register, handleSubmit, reset, watch, setValue } =
    useForm<DocumentFormValues>({
      resolver: zodResolver(documentSchema),

      defaultValues: EMPTY_DOCUMENT,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const shipping = watch("shipping");

  const discount = watch("discount");

  useEffect(() => {
    if (initialData) {
      reset(initialData as DocumentFormValues);
    }
  }, [initialData, reset]);

  useEffect(() => {
    const updatedItems = items.map((item) => ({
      ...item,

      total: calculateItemTotal(item),
    }));

    updatedItems.forEach((item, index) => {
      setValue(`items.${index}.total`, item.total);
    });

    const totals = calculateTotals(updatedItems, shipping, discount);

    setValue("subtotal", totals.subtotal);

    setValue("grand_total", totals.grand_total);
  }, [items, shipping, discount, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Document Number" {...register("document_number")} />

      <input type="date" {...register("document_date")} />

      <select {...register("document_type")}>
        <option value="quotation">Quotation</option>

        <option value="proforma">Proforma</option>

        <option value="tax_invoice">Invoice</option>
      </select>

      <input placeholder="Client ID" {...register("client_id")} />

      <hr />

      {fields.map((field, index) => (
        <DocumentItemRow
          key={field.id}
          index={index}
          register={register}
          onRemove={() => remove(index)}
        />
      ))}

      <button
        type="button"
        onClick={() =>
          append({
            serial_no: fields.length + 1,

            software_name: "",

            description: "",

            hsn_code: "",

            license_type: "",

            subscription_duration: "",

            quantity: 1,

            unit: "",

            rate: "0",

            discount: "0",

            tax_rate: "18",

            total: "0",

            extra: {},
          })
        }
      >
        Add Item
      </button>

      <TotalsPanel
        subtotal={watch("subtotal")}
        grandTotal={watch("grand_total")}
      />

      <button type="submit">Save Document</button>
    </form>
  );
}
