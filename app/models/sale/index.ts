export type Sale = {
  customerName: string;
  companyName: string;
  address?: string;
  productName: string;
  purchaseData: Date;
  amount: number;
  unitPrice: number;
  revenue: number;
};
