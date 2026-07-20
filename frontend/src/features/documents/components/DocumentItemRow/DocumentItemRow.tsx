import type { UseFormRegister } from "react-hook-form";
import type { DocumentFormValues } from "../../schemas/documentSchema";

interface Props {
  readonly index: number;
  readonly register: UseFormRegister<DocumentFormValues>;
  readonly onRemove: () => void;
}

export default function DocumentItemRow({ index, register, onRemove }: Props) {
  return (
    <div>
      <input
        placeholder="Software"
        {...register(`items.${index}.software_name`)}
      />

      <input
        placeholder="Description"
        {...register(`items.${index}.description`)}
      />

      <input placeholder="HSN" {...register(`items.${index}.hsn_code`)} />

      <input
        type="number"
        {...register(`items.${index}.quantity`, {
          valueAsNumber: true,
        })}
      />

      <input {...register(`items.${index}.unit`)} />

      <input {...register(`items.${index}.rate`)} />

      <input {...register(`items.${index}.discount`)} />

      <input {...register(`items.${index}.tax_rate`)} />

      <button type="button" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}
