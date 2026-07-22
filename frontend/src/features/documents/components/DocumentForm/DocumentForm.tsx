import { useEffect, useCallback, useRef } from "react";
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
import FormField from "../../../../components/common/FormField/FormField";
import Button from "../../../../components/common/Button/Button";
import styles from "./DocumentForm.module.css";

interface Props {
  readonly initialData?: Document;
  readonly onSubmit: (data: DocumentFormValues) => Promise<void>;
}

export default function DocumentForm({ initialData, onSubmit }: Props) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: EMPTY_DOCUMENT,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Use a ref to track if we need to recalculate, avoiding the infinite loop
  // that occurred when watching `items` directly in a useEffect dependency array.
  const recalcTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const recalculateTotals = useCallback(() => {
    const currentItems = getValues("items");
    const shipping = getValues("shipping");
    const discount = getValues("discount");

    const updatedItems = currentItems.map((item) => ({
      ...item,
      total: calculateItemTotal(item),
    }));

    updatedItems.forEach((item, index) => {
      const currentTotal = getValues(`items.${index}.total`);
      if (currentTotal !== item.total) {
        setValue(`items.${index}.total`, item.total, { shouldDirty: false });
      }
    });

    const totals = calculateTotals(updatedItems, shipping, discount);
    setValue("subtotal", totals.subtotal, { shouldDirty: false });
    setValue("grand_total", totals.grand_total, { shouldDirty: false });
  }, [getValues, setValue]);

  // Watch for changes and debounce recalculation
  useEffect(() => {
    const subscription = watch((_, { name }) => {
      // Only recalculate when relevant fields change
      if (
        name?.startsWith("items.") ||
        name === "shipping" ||
        name === "discount"
      ) {
        clearTimeout(recalcTimeoutRef.current);
        recalcTimeoutRef.current = setTimeout(recalculateTotals, 100);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(recalcTimeoutRef.current);
    };
  }, [watch, recalculateTotals]);

  useEffect(() => {
    if (initialData) {
      const formData: DocumentFormValues = {
        document_type: initialData.document_type,
        document_number: initialData.document_number,
        document_date: initialData.document_date,
        client_id: initialData.client_id,
        order_number: initialData.order_number,
        order_date: initialData.order_date ?? "",
        status: initialData.status,
        subtotal: initialData.subtotal,
        shipping: initialData.shipping,
        discount: initialData.discount,
        cgst: initialData.cgst,
        sgst: initialData.sgst,
        igst: initialData.igst,
        grand_total: initialData.grand_total,
        amount_in_words: initialData.amount_in_words,
        remarks: initialData.remarks,
        items: initialData.items.map((item) => ({
          serial_no: item.serial_no,
          software_name: item.software_name,
          description: item.description,
          hsn_code: item.hsn_code,
          license_type: item.license_type,
          subscription_duration: item.subscription_duration,
          quantity: item.quantity,
          unit: item.unit,
          rate: item.rate,
          discount: item.discount,
          tax_rate: item.tax_rate,
          total: item.total,
          extra: item.extra,
        })),
      };
      reset(formData);
    }
  }, [initialData, reset]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.headerFields}>
        <FormField label="Document Number" htmlFor="doc-number">
          <input id="doc-number" placeholder="INV-001" {...register("document_number")} />
        </FormField>

        <FormField label="Date" htmlFor="doc-date">
          <input id="doc-date" type="date" {...register("document_date")} />
        </FormField>

        <FormField label="Type" htmlFor="doc-type">
          <select id="doc-type" {...register("document_type")}>
            <option value="quotation">Quotation</option>
            <option value="proforma">Proforma</option>
            <option value="tax_invoice">Tax Invoice</option>
          </select>
        </FormField>

        <FormField label="Status" htmlFor="doc-status">
          <select id="doc-status" {...register("status")}>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </FormField>

        <FormField label="Client ID" htmlFor="doc-client">
          <input id="doc-client" placeholder="Client UUID" {...register("client_id")} />
        </FormField>

        <FormField label="Order Number" htmlFor="doc-order">
          <input id="doc-order" placeholder="PO-001" {...register("order_number")} />
        </FormField>
      </div>

      <hr />

      <div className={styles.itemsSection}>
        <h3 className={styles.sectionTitle}>Line Items</h3>

        {fields.map((field, index) => (
          <DocumentItemRow
            key={field.id}
            index={index}
            register={register}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}

        <div className={styles.addItemRow}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
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
            + Add Item
          </Button>
        </div>
      </div>

      <hr />

      <div className={styles.headerFields}>
        <FormField label="Shipping" htmlFor="doc-shipping">
          <input id="doc-shipping" placeholder="0.00" {...register("shipping")} />
        </FormField>

        <FormField label="Discount" htmlFor="doc-discount">
          <input id="doc-discount" placeholder="0.00" {...register("discount")} />
        </FormField>

        <FormField label="CGST" htmlFor="doc-cgst">
          <input id="doc-cgst" placeholder="0.00" {...register("cgst")} />
        </FormField>

        <FormField label="SGST" htmlFor="doc-sgst">
          <input id="doc-sgst" placeholder="0.00" {...register("sgst")} />
        </FormField>

        <FormField label="IGST" htmlFor="doc-igst">
          <input id="doc-igst" placeholder="0.00" {...register("igst")} />
        </FormField>
      </div>

      <TotalsPanel
        subtotal={watch("subtotal")}
        grandTotal={watch("grand_total")}
      />

      <FormField label="Amount in Words" htmlFor="doc-words">
        <input id="doc-words" placeholder="e.g. Rupees One Thousand Only" {...register("amount_in_words")} />
      </FormField>

      <FormField label="Remarks" htmlFor="doc-remarks">
        <textarea id="doc-remarks" placeholder="Additional notes" {...register("remarks")} />
      </FormField>

      <div className={styles.actions}>
        <Button type="submit" loading={isSubmitting} size="lg">
          Save Document
        </Button>
      </div>
    </form>
  );
}
