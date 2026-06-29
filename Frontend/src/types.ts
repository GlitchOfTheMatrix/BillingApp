export interface QuotationItem {
  id: number;
  sNo: string;
  description: string;
  qty: string;
  rate: string;
  per: string;
  total: string;
}

export interface QuotationDocument {
  id: string;
  date: string;
  clientName: string;
  amount: string;
  items: QuotationItem[];
}
