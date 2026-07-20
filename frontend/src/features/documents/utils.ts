import type { DocumentItem } from "./types";

export function calculateItemTotal(item: DocumentItem): string {
  const quantity = Number(item.quantity);
  const rate = Number(item.rate);
  const discount = Number(item.discount);
  const taxRate = Number(item.tax_rate);
  const taxable = quantity * rate - discount;
  const taxAmount = (taxable * taxRate) / 100;
  return (taxable + taxAmount).toFixed(2);
}

export function calculateTotals(
  items: DocumentItem[],
  shipping: string,
  discount: string,
) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(calculateItemTotal(item)),
    0,
  );

  const shippingValue = Number(shipping);
  const discountValue = Number(discount);
  const grandTotal = subtotal + shippingValue - discountValue;

  return {
    subtotal: subtotal.toFixed(2),

    grand_total: grandTotal.toFixed(2),
  };
}
