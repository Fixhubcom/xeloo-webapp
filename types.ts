
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
  username?: string;
  subRole?: UserSubRole;
  companyName?: string;
  bankAccounts?: BankAccount[];
  preferredCurrency?: string;
  avatarInitials: string;
  avatarBgColor: string;
  isSubscribed?: boolean;
  hederaWalletAddress?: string;
  accountOfficerId?: string;
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
  recipientAccount?: string;
  amountSentUSD?: number;
  amountReceivedUSD?: number;
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

export interface Employee {
    id: string;
    name: string;
    email: string;
    country: string;
    currency: string;
    salary: number;
    paymentMethod: 'bank' | 'xeloo';
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    xelooUsername?: string;
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
  recipientCountry?: string;
}

export interface MultiSigTransaction {
    id: string;
    partnerId: string;
    partnerName: string;
    amount: number;
    currency: string;
    destinationAddress: string;
    status: 'Pending Admin' | 'Pending Partner' | 'Completed' | 'Rejected';
}

export interface JournalEntry {
  id: number;
  date: string;
  description: string;
  account: string; // e.g., '1010 - Cash and Bank'
  debit: number;
  credit: number;
}

export type EscrowStatus = 'Awaiting Funding' | 'In Escrow' | 'Awaiting Release' | 'Completed' | 'Disputed' | 'Canceled';

export interface EscrowTransaction {
  id: string;
  buyerUsername: string;
  sellerUsername: string;
  amount: number;
  fee: number;
  description: string;
  status: EscrowStatus;
  createdAt: string;
  fundedAt?: string;
  releasedAt?: string;
}

export interface PublicUserProfile {
  id: string;
  name: string;
  username: string;
  companyName: string;
  avatarInitials: string;
  avatarBgColor: string;
}

export interface Bill {
  id: string;
  vendorName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}