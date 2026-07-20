import type { UseFormRegister } from "react-hook-form";
import type { DocumentFormValues } from "../../schemas/documentSchema";
import FormField from "../../../../components/common/FormField/FormField";
import Button from "../../../../components/common/Button/Button";
import styles from "./DocumentItemRow.module.css";

interface Props {
  readonly index: number;
  readonly register: UseFormRegister<DocumentFormValues>;
  readonly onRemove: () => void;
  readonly canRemove: boolean;
}

export default function DocumentItemRow({ index, register, onRemove, canRemove }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.rowHeader}>
        <span className={styles.rowNumber}>Item #{index + 1}</span>
        {canRemove && (
          <Button type="button" variant="danger" size="sm" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>

      <div className={styles.wideField}>
        <FormField label="Software" htmlFor={`item-sw-${index}`}>
          <input id={`item-sw-${index}`} placeholder="Software name" {...register(`items.${index}.software_name`)} />
        </FormField>
      </div>

      <div className={styles.wideField}>
        <FormField label="Description" htmlFor={`item-desc-${index}`}>
          <input id={`item-desc-${index}`} placeholder="Description" {...register(`items.${index}.description`)} />
        </FormField>
      </div>

      <FormField label="HSN Code" htmlFor={`item-hsn-${index}`}>
        <input id={`item-hsn-${index}`} placeholder="HSN" {...register(`items.${index}.hsn_code`)} />
      </FormField>

      <FormField label="Qty" htmlFor={`item-qty-${index}`}>
        <input
          id={`item-qty-${index}`}
          type="number"
          min={1}
          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
        />
      </FormField>

      <FormField label="Unit" htmlFor={`item-unit-${index}`}>
        <input id={`item-unit-${index}`} placeholder="Nos" {...register(`items.${index}.unit`)} />
      </FormField>

      <FormField label="Rate" htmlFor={`item-rate-${index}`}>
        <input id={`item-rate-${index}`} placeholder="0.00" {...register(`items.${index}.rate`)} />
      </FormField>

      <FormField label="Discount" htmlFor={`item-disc-${index}`}>
        <input id={`item-disc-${index}`} placeholder="0" {...register(`items.${index}.discount`)} />
      </FormField>

      <FormField label="Tax %" htmlFor={`item-tax-${index}`}>
        <input id={`item-tax-${index}`} placeholder="18" {...register(`items.${index}.tax_rate`)} />
      </FormField>
    </div>
  );
}
