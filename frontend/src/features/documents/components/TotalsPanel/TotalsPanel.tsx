interface Props {
  readonly subtotal: string;
  readonly grandTotal: string;
}

export default function TotalsPanel({ subtotal, grandTotal }: Props) {
  return (
    <div>
      <h3>Subtotal: ₹{subtotal}</h3>

      <h2>Grand Total: ₹{grandTotal}</h2>
    </div>
  );
}
