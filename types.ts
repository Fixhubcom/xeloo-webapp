
export enum UserRole {
  USER = 'USER',
  PARTNER = 'PARTNER',
  MERCHANT = 'MERCHANT',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
}

export interface Transaction {
  id: string;
  date: string;
  recipient: string;
  recipientCountry: string;
  amountSent: number;
  currencySent: string;
  amountReceived: number;
  currencyReceived: string;
  commission: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Invoice {
  id: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface PartnerSettlement {
    id: string;
    date: string;
    partnerName: string;
    amount: number;
    currency: string;
    status: 'Settled' | 'Pending';
}

export interface AssetListing {
    id: string;
    asset: 'USDT';
    amount: number;
    pricePerUnit: number;
    localCurrency: string;
    status: 'Active' | 'Sold';
}

export interface OnboardingSuggestions {
  businessCategory: string;
  kybRiskLevel: 'Low' | 'Medium' | 'High';
  complianceNotes: string[];
}
