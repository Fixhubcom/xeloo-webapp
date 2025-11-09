
export enum UserRole {
  USER = 'USER',
  PARTNER = 'PARTNER',
  MERCHANT = 'MERCHANT',
  ADMIN = 'ADMIN',
}

export enum UserSubRole {
  ADMINISTRATOR = 'Administrator',
  ACCOUNTANT = 'Accountant',
  AUDITOR = 'Auditor',
  STANDARD = 'Standard',
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  country: string;
  currency: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subRole?: UserSubRole;
  companyName?: string;
  bankAccounts?: BankAccount[];
  preferredCurrency?: string;
  avatarInitials: string;
  // FIX: Corrected typo in property name from avatarBgCcolor to avatarBgColor.
  avatarBgColor: string;
  isSubscribed?: boolean;
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
  category?: string;
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

export interface RecurringPayment {
  id: string;
  recipientName: string;
  amount: number;
  currency: string;
  frequency: 'Weekly' | 'Monthly' | 'Quarterly';
  nextPaymentDate: string;
  endDate?: string;
  status: 'Active' | 'Paused';
}